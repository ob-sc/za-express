export const selectOptions = (req, res, next) => {
  try {
    const conn = res.connectDB();
    const sql = 'SELECT id AS optval, name AS optlabel FROM stationen';
    const qry = res.query(conn, sql);
    await close();

    if (!qry.isEmpty) res.okmsg(res, qry.result);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

export const signatur = (req, res, next) => {
  try {
    const { id } = req.params;

    const conn = res.connectDB();
    const sql = 'SELECT * FROM stationen WHERE id = ?';
    const qry = res.query(conn, sql, [id]);
    await close();

    if (!qry.isEmpty) res.okmsg(res, qry.result[0]);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};
