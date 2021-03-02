import express from 'express';
import bcrypt from 'bcryptjs';
import connection from '../util/connection.js';
import query from '../util/query.js';
import { signUp } from '../validations/user.js';
import { errmsg, okmsg } from '../util/response.js';

const router = express.Router();

router.post('', async (req, res, next) => {
  try {
    const { error, value } = signUp.validate(req.body);
    const { username, password, station } = value;
    if (error) throw error;

    const conn = await connection();
    const checkUserSQL = 'SELECT * FROM benutzer WHERE username = ?';
    const checkUser = await query(conn, checkUserSQL, [username]);

    if (checkUser.isEmpty) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const signUpSQL =
          'INSERT INTO benutzer (username, password, station) VALUES (?,?,?)';
        query(conn, signUpSQL, [username, hash, station]).then((data) => {
          if (data.affectedRows > 0) okmsg(res, 'Benutzer angelegt');
        });
      });
    } else errmsg(res, 'Benutzer bereits vorhanden', 409);

    conn.release();
  } catch (err) {
    next(err);
  }
});

export default router;
