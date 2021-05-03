import express from 'express';
import bcrypt from 'bcryptjs';
import connection from '../util/connection.js';
import query from '../util/query.js';
import sessionValidation from '../validations/session.js';
import { errmsg, okmsg } from '../util/response.js';
const debug = require('debug')('za-express:server');

const router = express.Router();

// check ob logged in
router.get('', (req, res) => {
  const { session } = req;
  if (session.user !== undefined && session.user.isLoggedIn === true)
    okmsg(res, req.session.user);
  else okmsg(res, { isLoggedIn: false });
});

// login
router.post('', async (req, res, next) => {
  try {
    const { error, value } = sessionValidation.validate(req.body);
    if (error) throw error;
    const { username, password } = value;

    // todo login dauert manchmal 10s
    // bis jetzt nur nach session expire auf dem server
    // dafür müsste hier in dem SQL block jmd schuld sein
    debug('login', username);
    const conn = await connection();
    debug(typeof conn, 'conn');
    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const data = await query(conn, sql, [username]);
    debug(typeof data, 'data');
    conn.release();
    debug('done');

    if (data.isEmpty) errmsg(res, 'Benutzer nicht gefunden', 401);
    else {
      const user = data.result[0];
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) throw error;
        if (result === true) {
          req.session.user = {
            username: user.username,
            station: user.station,
            access: user.access,
            region: user.region,
            extstat: user.extstat,
            currentStation: user.station,
            isLoggedIn: true,
          };
          okmsg(res);
        } else errmsg(res, 'Passwort falsch', 401);
      });
    }
  } catch (err) {
    next(err);
  }
});

// station ändern
router.put('', (req, res, next) => {
  const { body, session } = req;
  try {
    const user = session.user;
    if (user) {
      session.user.currentStation = body.station;
      okmsg(res);
    } else errmsg(res, 'Etwas ist fehlgeschlagen', 422);
  } catch (err) {
    next(err);
  }
});

// logout
router.delete('', (req, res, next) => {
  const { session } = req;
  try {
    const user = session.user;
    if (user) {
      session.destroy((err) => {
        if (err) throw err;
        res.clearCookie(process.env.SESS_NAME);
        okmsg(res);
      });
    } else okmsg(res, {}, 205);
  } catch (err) {
    next(err);
  }
});

export default router;
