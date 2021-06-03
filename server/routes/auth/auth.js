import bcrypt from 'bcryptjs';
import connection from '../../util/connection.js';
import query from '../../util/query.js';
import sessionValidation from '../../validations/session.js';
import { errmsg, okmsg } from '../../util/response.js';

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

    const conn = await connection();
    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const qry = await query(conn, sql, [username]);
    conn.release();

    if (
      req.headers.host === 'onboarding.starcar.local' &&
      query.result[0].allow_onboarding !== 1
    )
      return errmsg(
        res,
        'Benutzer ist nicht für das onboarding freigegeben',
        401
      );
    console.log(req.headers.host);

    if (qry.isEmpty === true) errmsg(res, 'Benutzer nicht gefunden', 401);
    else {
      const [user] = qry.result;

      bcrypt.compare(password, user.password, (error, result) => {
        if (error) throw error;
        if (result !== true) errmsg(res, 'Passwort falsch', 401);
        else if (user.active !== 1) errmsg(res, 'Account nicht bestätigt', 400);
        else {
          req.session.user = createSession(user);
          okmsg(res, req.session.user);
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

export const updateStation = (req, res, next) => {
  const { body, session } = req;
  try {
    if (session.user !== undefined) {
      session.user.currentStation = body.station;
      okmsg(res);
    } else errmsg(res, 'Etwas ist fehlgeschlagen', 422);
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
        okmsg(res);
      });
    } else okmsg(res, {}, 205);
  } catch (err) {
    next(err);
  }
};
