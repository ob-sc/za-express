import bcrypt from 'bcryptjs';
import connection from '../../util/connection.js';
import query from '../../util/query.js';
import sessionValidation from '../../validation/session.js';

const createSession = (user) => ({
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

export const isLoggedIn = (req, res) => {
  const { session } = req;
  if (session.user !== undefined && session.user.isLoggedIn === true)
    okmsg(res, req.session.user);
  else okmsg(res, { isLoggedIn: false });
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = sessionValidation.validate(req.body);
    if (error) throw error;
    const { username, password } = value;

    const conn = await res.connection();
    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const qry = await res.query(conn, sql, [username]);
    conn.release();

    if (qry.isEmpty === true) return res.errmsg('Benutzer nicht gefunden', 401);

    if (
      req.headers.host.includes('onboarding') &&
      qry.result[0].allow_onboarding !== 1
    )
      return errmsg(
        res,
        'Benutzer ist nicht für das Onboarding freigegeben',
        401
      );

    const [user] = qry.result;
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) throw error;
      if (result !== true) res.errmsg('Passwort falsch', 401);
      else if (user.active !== 1) res.errmsg('Account nicht bestätigt', 400);
      else {
        req.session.user = createSession(user);
        okmsg(res, req.session.user);
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
      res.okmsg();
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
        res.okmsg();
      });
    } else okmsg(res, {}, 205);
  } catch (err) {
    next(err);
  }
};
