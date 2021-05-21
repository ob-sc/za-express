import express from 'express';
import bcrypt from 'bcryptjs';
import connection from '../util/connection.js';
import query from '../util/query.js';
import sessionValidation from '../validations/session.js';
import { errmsg, okmsg } from '../util/response.js';
// const debug = require('debug')('za-express:server');

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

    const conn = await connection();
    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const data = await query(conn, sql, [username]);
    conn.release();

    if (data.isEmpty) errmsg(res, 'Benutzer nicht gefunden', 401);
    else {
      const [user] = data.result;
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) throw error;
        if (result === true) {
          req.session.user = {
            username: user.username,
            admin: user.admin === 1,
            station: user.station,
            access: user.access,
            region: user.region,
            extstat: user.extstat,
            currentStation: user.station,
            onboarding: user.onboarding,
            isLoggedIn: true,
          };
          okmsg(res, req.session.user);
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
    if (session.user !== undefined) {
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
});

export default router;
