export const selectMax = async (req, res, next) => {
  try {
    const { id, status, firstDayMonth } = req.body;
    const isStudent = status.toLowerCase() === 'student';

    const conn = await res.connection();

    const sql = isStudent
      ? 'SELECT sum(arbeitszeit) as max FROM zeiten WHERE ahid = ? AND yearweek(DATE(datum), 1) = yearweek(CURDATE(), 1)'
      : 'SELECT sum(gehalt) AS max FROM zeiten WHERE ahid = ? AND LOWER(ahmax) <> "student" AND datum BETWEEN ? AND CURDATE()';
    const qry = await res.query(conn, sql, [id, firstDayMonth]);

    const result = {
      id,
      status: status.toLowerCase(),
      sum: qry.result[0].max,
    };
    okmsg(res, result);
    conn.release();
  } catch (err) {
    next(err);
  }
};
