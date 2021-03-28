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
    const sql =
      'INSERT INTO angemeldet (ahid, station, date, start) VALUES (?,?,?,?)';
    const data = await query(conn, sql, [ahid, station, date, start]);
    conn.release();

    if (data.isUpdated) okmsg(res);
    else errmsg(res, 'Fehler beim Anmelden der Aushilfe', 400);
  } catch (err) {
    next(err);
  }
});

router.get('', async (req, res, next) => {
  try {
    const conn = await connection();

    const sql =
      'SELECT ang.id, ang.ahid, ang.date, ang.start, ah.vorname, ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?';

    const { result } = await query(conn, sql, [
      req.session.user.currentStation,
    ]);

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
