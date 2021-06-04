export const anmelden = async (req, res, next) => {
  try {
    const { ahid, date, start } = req.body;
    const { station } = req.session.user;

    const conn = await res.connection();

    const sql = 'SELECT * FROM angemeldet WHERE ahid = ?';
    const qry = await res.query(conn, sql, [ahid]);

    if (qry.isEmpty === false)
      res.errmsg('Aushilfe ist bereits angemeldet', 409);
    else {
      const sql2 =
        'INSERT INTO angemeldet (ahid, station, date, start) VALUES (?,?,?,?)';
      const data = await res.query(conn, sql2, [ahid, station, date, start]);

      if (data.isUpdated === true) res.okmsg();
      else res.errmsg('Fehler beim Anmelden der Aushilfe', 400);
    }
    conn.release();
  } catch (err) {
    next(err);
  }
};

export const getAnmeldungen = async (req, res, next) => {
  try {
    const conn = await res.connection();

    const sql =
      'SELECT ang.id, ang.ahid, ang.date, ang.start, ah.vorname, ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?';

    const qry = await res.query(conn, sql, [req.session.user.currentStation]);
    conn.release();

    if (qry.isEmpty === false) res.okmsg(res, qry.result);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

export const deleteAnmeldung = async (req, res, next) => {
  try {
    const { id } = req.body;

    const conn = await res.connection();
    const sql = 'DELETE FROM angemeldet WHERE id = ?';
    const qry = await res.query(conn, sql, [id]);
    conn.release();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg('Fehler beim Löschen der Anmeldung', 400);
  } catch (err) {
    next(err);
  }
};
