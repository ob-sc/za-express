import { RequestHandler } from 'express';

export const anmelden: RequestHandler = (req, res, next) => {
  try {
    const { ahid, date, start } = req.body;
    const station = req.session.user?.station;

    const conn = res.connectDB();

    const sql = 'SELECT * FROM angemeldet WHERE ahid = ?';
    const qry = res.query(conn, sql, [ahid]);

    if (qry?.isEmpty === false)
      res.errmsg('Aushilfe ist bereits angemeldet', 409);
    else {
      const sql2 =
        'INSERT INTO angemeldet (ahid, station, date, start) VALUES (?,?,?,?)';
      const data = res.query(conn, sql2, [ahid, station, date, start]);

      if (data?.isUpdated === true) res.okmsg();
      else res.errmsg('Fehler beim Anmelden der Aushilfe', 400);
    }
    conn?.release();
  } catch (err) {
    next(err);
  }
};

export const getAnmeldungen: RequestHandler = (req, res, next) => {
  try {
    const conn = res.connectDB();

    const sql =
      'SELECT ang.id, ang.ahid, ang.date, ang.start, ah.vorname, ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?';

    const qry = res.query(conn, sql, [req.session.user?.currentStation]);
    conn?.release();

    if (qry?.isEmpty === false) res.okmsg(qry.result);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

export const deleteAnmeldung: RequestHandler = (req, res, next) => {
  try {
    const { id } = req.body;

    const conn = res.connectDB();
    const sql = 'DELETE FROM angemeldet WHERE id = ?';
    const qry = res.query(conn, sql, [id]);
    conn?.release();

    if (qry?.isUpdated === true) res.okmsg();
    else res.errmsg('Fehler beim Löschen der Anmeldung', 400);
  } catch (err) {
    next(err);
  }
};
