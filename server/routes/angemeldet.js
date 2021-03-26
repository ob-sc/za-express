import express from 'express';

import { okmsg } from '../util/response.js';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';

const router = express.Router();

router.use(auth);

router.get('', async (req, res, next) => {
  try {
    const conn = await connection();

    const sql =
      'SELECT ang.ahid AS id, ang.date, ang.start, ah.vorname, ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?';

    const { result } = await query(conn, sql, [
      req.session.user.currentStation,
    ]);

    okmsg(res, result);
    conn.release();
  } catch (err) {
    next(err);
  }
});

export default router;
