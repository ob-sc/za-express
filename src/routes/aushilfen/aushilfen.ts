export const getAushilfen = async (req, res, next) => {
  try {
    const conn = await res.connection();
    const sql =
      "SELECT * FROM aushilfen WHERE status <> 'passiv' ORDER BY station, nachname";
    const qry = await res.query(conn, sql);

    conn.release();
    if (qry.isEmpty === false) res.okmsg(res, qry.result);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};
