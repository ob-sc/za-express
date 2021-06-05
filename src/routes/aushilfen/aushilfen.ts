import { RequestHandler } from 'express';

export const getAushilfen: RequestHandler = (req, res, next) => {
  try {
    const conn = res.connectDB();
    const sql =
      "SELECT * FROM aushilfen WHERE status <> 'passiv' ORDER BY station, nachname";
    const qry = res.query(conn, sql);

    conn?.release();
    if (qry?.isEmpty === false) res.okmsg(qry.result);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};
