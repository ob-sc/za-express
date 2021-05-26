import { okmsg, errmsg } from '../../util/response.js';
import connection from '../../util/connection.js';
import query from '../../util/query.js';

export const anmelden = async (req, res, next) => {
  try {
    const { ahid, date, start } = req.body;
    const { station } = req.session.user;

    const conn = await connection();

    const sql = 'SELECT * FROM angemeldet WHERE ahid = ?';
    const qry = await query(conn, sql, [ahid]);

    if (qry.isEmpty === false)
      errmsg(res, 'Aushilfe ist bereits angemeldet', 409);
    else {
      const sql2 =
        'INSERT INTO angemeldet (ahid, station, date, start) VALUES (?,?,?,?)';
      const data = await query(conn, sql2, [ahid, station, date, start]);

      if (data.isUpdated === true) okmsg(res);
      else errmsg(res, 'Fehler beim Anmelden der Aushilfe', 400);
    }
    conn.release();
  } catch (err) {
    next(err);
  }
};

export const getAnmeldungen = async (req, res, next) => {
  try {
    const conn = await connection();

    const sql =
      'SELECT ang.id, ang.ahid, ang.date, ang.start, ah.vorname, ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?';

    const qry = await query(conn, sql, [req.session.user.currentStation]);
    conn.release();

    if (qry.isEmpty === false) okmsg(res, qry.result);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

export const deleteAnmeldung = async (req, res, next) => {
  try {
    const { id } = req.body;

    const conn = await connection();
    const sql = 'DELETE FROM angemeldet WHERE id = ?';
    const qry = await query(conn, sql, [id]);
    conn.release();

    if (qry.isUpdated === true) okmsg(res);
    else errmsg(res, 'Fehler beim Löschen der Anmeldung', 400);
  } catch (err) {
    next(err);
  }
};
