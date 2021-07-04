import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { RequestHandler } from 'express';
import { Account, Benutzer } from '../../../za-types/server/database';
import { SignUpRequest } from '../../../za-types/server/requests';
import sqlStrings from '../../sql';
import { scEmail } from '../../util/helper';
import userValidation from '../../validation/user';
import { confirmMail } from './mail';

export const signUp: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { error, value } = userValidation.validate(req.body);
    if (error) throw error;
    const { username, password, station }: SignUpRequest = value;

    const qry = await query<Benutzer>(sqlStrings.benutzer.sel, [username]);

    if (qry.isEmpty !== true) {
      await close();
      return res.errmsg('Benutzer bereits vorhanden', 409);
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) throw err;
      const qry2 = await query(sqlStrings.benutzer.ins, {
        username,
        password: hash,
        station,
      });
      if (qry2.isUpdated === true) {
        const token = crypto.randomBytes(20).toString('hex');

        const qry3 = await query(sqlStrings.account.ins, {
          id: qry2.id,
          token,
        });
        await close();

        const email = scEmail(username);
        await confirmMail({ token, to: email });

        if (qry3.isUpdated) return res.okmsg();
        return res.errmsg('Kein token eingetragen');
      }
      await close();
      res.errmsg('Kein Benutzer eingetragen');
    });
  }, close);
};

export const confirmAccount: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { token } = req.params;

    const sql = 'SELECT * FROM account WHERE token = ?';
    const qry = await query<Account>(sql, [token]);

    if (qry.isEmpty === true) res.errmsg('Token nicht gefunden');
    else {
      const [tokenResult] = qry.results;

      const sinceReg = Date.now() - new Date(tokenResult.reg_date).getTime();

      if (sinceReg / 1000 / 60 / 60 > 24) res.errmsg('Link abgelaufen', 410);
      else {
        const qry2 = await query(sqlStrings.benutzer.updActive, [tokenResult.id]);

        if (qry2.isUpdated) res.okmsg('Account erfolgreich bestätigt');
        else res.errmsg('Account nicht bestätigt');
      }

      // in beiden fällen token löschen
      await query(sqlStrings.account.del, [token]);
    }

    await close();
  }, close);
};
