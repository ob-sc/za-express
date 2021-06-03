import connection from '../../util/connection.js';
import query from '../../util/query.js';
import { errmsg, okmsg } from '../../util/response.js';

export const selectOptions = async (req, res, next) => {
  try {
    const conn = await connection();
    const sql = 'SELECT id AS optval, name AS optlabel FROM stationen';
    const qry = await query(conn, sql);
    conn.release();

    if (!qry.isEmpty) okmsg(res, qry.result);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

export const signatur = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conn = await connection();
    const sql = 'SELECT * FROM stationen WHERE id = ?';
    const qry = await query(conn, sql, [id]);
    conn.release();

    if (!qry.isEmpty) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};
