import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import sessionValidation from '../../validation/session.js';
import { sess } from '../../config.js';
import { Benutzer } from '../../types/database.js';
import { EmptySession, UserSession } from '../../types/session.js';

const createSession: (user: Benutzer) => UserSession = (user) => ({
  username: user.username,
  admin: user.admin === 1,
  station: user.station,
  access: user.access,
  region: user.region,
  extstat: user.extstat,
  currentStation: user.station,
  onboarding: user.onboarding,
  isLoggedIn: true,
});

const emptySession: EmptySession = { isLoggedIn: false };

export const isLoggedIn: RequestHandler = (req, res) => {
  if (req.session.user?.isLoggedIn === true) res.okmsg(req.session.user);
  else res.okmsg(emptySession);
};

export const login: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { error, value } = sessionValidation.validate(req.body);
    if (error) throw error;
    const { username, password } = value;

    const isOnboarding = req.headers.host?.includes('onboarding');

    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const qry = await query<Benutzer>(sql, [username]);
    await close();

    const [user] = qry.results;

    if (qry.isEmpty === true) return res.errmsg('Benutzer nicht gefunden', 401);

    if (isOnboarding && user.allow_onboarding !== 1)
      return res.errmsg(
        'Benutzer ist nicht für das Onboarding freigegeben',
        401
      );

    bcrypt.compare(password, user.password, (error, result) => {
      if (error) throw error;
      if (result !== true) return res.errmsg('Passwort falsch', 401);
      else if (user.active !== 1)
        return res.errmsg('Account nicht bestätigt', 400);

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
