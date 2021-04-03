import express from 'express';
import { okmsg, errmsg } from '../util/response.js';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';

const router = express.Router();

router.use(auth);

router.post('', async (req, res, next) => {
  try {
    const { ahid, date, start } = req.body;
    const { station } = req.session.user;

    const conn = await connection();

    const sql = 'SELECT * FROM angemeldet WHERE ahid = ?';
    const checkAnmeldung = await query(conn, sql, [ahid]);

    if (!checkAnmeldung.isEmpty)
      errmsg(res, 'Aushilfe ist bereits angemeldet', 409);
    else {
      const sql2 =
        'INSERT INTO angemeldet (ahid, station, date, start) VALUES (?,?,?,?)';
      const data = await query(conn, sql2, [ahid, station, date, start]);

      if (data.isUpdated) okmsg(res);
      else errmsg(res, 'Fehler beim Anmelden der Aushilfe', 400);
    }
    conn.release();
  } catch (err) {
    next(err);
  }
});

router.get('aushilfen/:ahid', async (req, res, next) => {
  try {
    console.log(req.params);
    const conn = await connection();

    const sql = 'SELECT * FROM zeiten WHERE ahid = ?';

    const { result } = await query(conn, sql, [req.params.ahid]);

    okmsg(res, result);
    conn.release();
  } catch (err) {
    next(err);
  }
});

router.delete('', async (req, res, next) => {
  try {
    const { id } = req.body;

    const conn = await connection();
    const sql = 'DELETE FROM angemeldet WHERE id = ?';
    const data = await query(conn, sql, [id]);
    conn.release();

    if (data.isUpdated) okmsg(res);
    else errmsg(res, 'Fehler beim Löschen der Anmeldung', 400);
  } catch (err) {
    next(err);
  }
});

export default router;
