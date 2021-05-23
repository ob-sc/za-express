import { okmsg } from '../../util/response.js';
import connection from '../../util/connection.js';
import query from '../../util/query.js';

export const getAushilfen = async (req, res, next) => {
  try {
    const conn = await connection();
    const sql =
      "SELECT * FROM aushilfen WHERE status <> 'passiv' ORDER BY station, nachname";
    const { result } = await query(conn, sql);

    conn.release();
    okmsg(res, result);
  } catch (err) {
    next(err);
  }
};
