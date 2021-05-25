import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connection from '../../util/connection.js';
import query from '../../util/query.js';
import userValidation from '../../validations/user.js';
import { errmsg, okmsg } from '../../util/response.js';

export const signUp = async (req, res, next) => {
  try {
    const { error, value } = userValidation.validate(req.body);
    if (error) throw error;
    const { username, password, station } = value;

    const conn = await connection();
    const sql = 'SELECT * FROM benutzer WHERE username = ?';
    const qry = await query(conn, sql, [username]);

    if (!qry.isEmpty) errmsg(res, 'Benutzer bereits vorhanden', 409);
    else
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const sql2 =
          'INSERT INTO benutzer (username, password, station) VALUES (?,?,?)';
        query(conn, sql2, [username, hash, station]).then((data) => {
          if (data.isUpdated) okmsg(res);
        });
      });

    conn.release();

    const token = crypto.randomBytes(20).toString('hex');
    const email = `${username}@starcar.de`;
    await confirmAccount(token, email);
  } catch (err) {
    next(err);
  }
};

export const confirmAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const conn = await connection();

    const sql = 'SELECT * FROM account WHERE token = ?';
    const qry = await query(conn, sql, [token]);
    const { id, reg_date } = qry[0].result;

    const sinceReg = Date.now() - new Date(reg_date).getTime();

    if (sinceReg / 1000 / 60 / 60 > 24) errmsg(res, 'Link abgelaufen', 410);
    else {
      const sql2 = 'UPDATE benutzer SET active=1 WHERE id = ?';
      const qry2 = await query(conn, sql2, [id]);

      if (qry2.isUpdated) okmsg(res);
      else errmsg(res, 'Benutzer nicht aktiviert');
    }

    const sql3 = 'DELETE FROM account WHERE token = ?';
    await query(conn, sql3, [token]);

    conn.release();
  } catch (err) {
    next(err);
  }
};
