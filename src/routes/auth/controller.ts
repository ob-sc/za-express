import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import sessionValidation from '../../validation/session';
import { sess } from '../../config';
import { Benutzer } from '../../../za-types/server/database';
import { UserSession } from '../../../za-types/server/session';
import sqlStrings from '../../sql';
import { LoginRequest } from '../../../za-types/server/requests';
import { parseStringArray } from '../../util/helper';
import { CreateSession } from '../../../za-types/server/onboarding';

const createSession: CreateSession = (user) => ({
  username: user.username,
  admin: user.admin,
  station: user.station,
  access: user.access,
  region: user.region,
  extstat: parseStringArray(user.extstat),
  currentStation: user.station,
  onboarding: user.onboarding?.split(',') ?? [],
  isLoggedIn: true,
});

const emptySession: UserSession = {
  username: '',
  admin: false,
  isLoggedIn: false,
  onboarding: [],
};

export const isLoggedIn: RequestHandler = (req, res) => {
  if (req.session.user?.isLoggedIn === true) res.okmsg(req.session.user);
  else res.okmsg(emptySession);
};

export const login: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { error, value } = sessionValidation.validate(req.body);
    if (error) throw error;
    const { username, password }: LoginRequest = value;

    const qry = await query<Benutzer>(sqlStrings.benutzer.sel, [username]);
    await close();

    const [user] = qry.results;

    if (qry.isEmpty === true) return res.errmsg('Benutzer nicht gefunden', 401);

    const isOnboarding = req.headers.host?.includes('onboarding');
    const allowOnboarding = user.allow_onboarding === true;
    const isDisponent = user?.access === 0;

    if (isOnboarding && (isDisponent || !allowOnboarding))
      return res.errmsg('Benutzer ist nicht für das Onboarding freigegeben', 401);

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw error;
      if (result !== true) return res.errmsg('Passwort falsch', 401);
      if (user.active !== true) return res.errmsg('Account nicht bestätigt', 400);

      req.session.user = createSession(user);
      res.okmsg(req.session.user);
    });
  }, close);
};

export const updateStation: RequestHandler = async (req, res) => {
  const { body, session } = req;

  if (session.user !== undefined) {
    session.user.currentStation = body.station;
    res.okmsg();
  } else res.errmsg('Session existiert nicht', 422);
};

export const logout: RequestHandler = async (req, res) => {
  const { session } = req;

  await res.catchError(async () => {
    if (session.user === undefined) res.okmsg('Session existiert nicht', 205);
    else
      session.destroy((err) => {
        if (err) throw err;
        res.clearCookie(sess.name);
        res.okmsg('Logout erfolgreich');
      });
  });
};
