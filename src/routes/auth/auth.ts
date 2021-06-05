import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import { Benutzer } from '../../types/db/index.js';
import { UserSession } from '../../types/index.js';
import sessionValidation from '../../validation/session.js';

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

export const isLoggedIn: RequestHandler = (req, res) => {
  const { session } = req;
  if (session.user !== undefined && session.user.isLoggedIn === true) {
    res.okmsg(req.session.user);
  } else {
    res.okmsg({ isLoggedIn: false });
  }
};

export const login: RequestHandler = (req, res, next) => {
  try {
    const { error, value } = sessionValidation.validate(req.body);
    if (error) throw error;
    const { username, password } = value;

    const isOnboarding = req.headers.host?.includes('onboarding');

    const conn = res.connectDB();
    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const qry = res.query<Benutzer>(conn, sql, [username]);
    conn?.release();

    const user = qry?.results[0];

    if (user === undefined)
      res.errmsg('Verbindung zu Datenbank fehlgeschlagen');

    if (qry?.isEmpty === true) res.errmsg('Benutzer nicht gefunden', 401);

    if (isOnboarding && user?.allow_onboarding !== 1)
      res.errmsg('Benutzer ist nicht für das Onboarding freigegeben', 401);

    bcrypt.compare(password, user?.password, (error, result) => {
      if (error) throw error;
      if (result !== true) res.errmsg('Passwort falsch', 401);
      else if (user?.active !== 1) res.errmsg('Account nicht bestätigt', 400);
      else {
        req.session.user = createSession(user);
        res.okmsg(req.session.user);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateStation = (req, res, next) => {
  const { body, session } = req;
  try {
    if (session.user !== undefined) {
      session.user.currentStation = body.station;
      res.res.okmsg();
    } else res.errmsg('Etwas ist fehlgeschlagen', 422);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  const { session } = req;
  try {
    if (session.user !== undefined) {
      session.destroy((err) => {
        if (err) throw err;
        res.clearCookie(process.env.SESS_NAME);
        res.res.okmsg();
      });
    } else res.okmsg(res, {}, 205);
  } catch (err) {
    next(err);
  }
};
