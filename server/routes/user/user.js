import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connection from '../../util/connection.js';
import query from '../../util/query.js';
import userValidation from '../../validations/user.js';
import { errmsg, okmsg } from '../../util/response.js';
import { confirmMail, infoMail } from './mail';

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
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) throw err;
        const sql2 = 'INSERT INTO benutzer SET ?';
        const qry2 = await query(conn, sql2, {
          username,
          password: hash,
          station,
        });
        if (qry2.isUpdated) {
          const token = crypto.randomBytes(20).toString('hex');

          const sql3 = 'INSERT INTO account SET ?';
          const qry3 = await query(conn, sql3, {
            id: qry2.id,
            token,
          });

          if (qry3.isUpdated) okmsg(res);
          else errmsg(res, 'Kein token eingetragen');

          const email = `${username}@starcar.de`;
          confirmMail(token, email);
          infoMail(username);
        }
      });

    conn.release();
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

    if (qry.isEmpty === true) errmsg(res, 'Token nicht gefunden');
    else {
      const [tokenResult] = qry.result;

      const sinceReg = Date.now() - new Date(tokenResult.reg_date).getTime();

      if (sinceReg / 1000 / 60 / 60 > 24) errmsg(res, 'Link abgelaufen', 410);
      else {
        const sql2 = 'UPDATE benutzer SET active=1 WHERE id = ?';
        const qry2 = await query(conn, sql2, [tokenResult.id]);

        if (qry2.isUpdated) okmsg(res, 'Account erfolgreich bestätigt');
        else errmsg(res, 'Account nicht bestätigt');
      }

      const sql3 = 'DELETE FROM account WHERE token = ?';
      await query(conn, sql3, [token]);
    }

    conn.release();
  } catch (err) {
    next(err);
  }
};
