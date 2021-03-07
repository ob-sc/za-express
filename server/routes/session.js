import express from 'express';
import bcrypt from 'bcryptjs';
import connection from '../util/connection.js';
import query from '../util/query.js';
import sessionValidation from '../validations/session.js';
import { errmsg, okmsg } from '../util/response.js';

const router = express.Router();

// check if logged in
router.get('', (req, res) => {
  const { session } = req;
  if (session.user !== undefined && session.user.isLoggedIn === true)
    okmsg(res, 'Session aktiv', req.session.user);
  else okmsg(res, 'Nicht angemeldet', { isLoggedIn: false });
  // else errmsg(res, 'Nicht angemeldet', 401);
});

// create session
router.post('', async (req, res, next) => {
  try {
    const { error, value } = sessionValidation.validate(req.body);
    if (error) throw error;
    const { username, password } = value;

    const conn = await connection();
    const selectUserSQL = 'SELECT * FROM benutzer WHERE username = ?';
    const selectUser = await query(conn, selectUserSQL, [username]);

    if (selectUser.isEmpty) errmsg(res, 'Benutzer oder Passwort falsch', 401);
    else
      bcrypt.compare(password, selectUser[0]['password'], (error, result) => {
        if (error) throw error;
        if (result === true) {
          req.session.user = {
            ...selectUser[0],
            password: null,
            isLoggedIn: true,
          };
          okmsg(res, 'Angemeldet', req.session.user);
        } else errmsg(res, 'Benutzer oder Passwort falsch', 401);
      });

    conn.release();
  } catch (err) {
    next(err);
  }
});

// destroy session
router.delete('', (req, res, next) => {
  const { session } = req;
  try {
    const user = session.user;
    if (user) {
      session.destroy((err) => {
        if (err) throw err;
        res.clearCookie(process.env.SESS_NAME);
        okmsg(res, 'Erfolgreich abgemeldet');
      });
    } else errmsg(res, 'Etwas ist fehlgeschlagen', 422);
  } catch (err) {
    next(err);
  }
});

export default router;
