import express from 'express';
import { okmsg } from '../util/response.js';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';

const router = express.Router();

router.use(auth);

router.post('/max', async (req, res, next) => {
  try {
    const { id, status, firstDayMonth } = req.body;
    const isStudent = status.toLowerCase() === 'student';

    const conn = await connection();

    const sql = isStudent
      ? 'SELECT sum(arbeitszeit) as max FROM zeiten WHERE ahid = ? AND LOWER(ahmax) = "student" AND yearweek(DATE(datum), 1) = yearweek(CURDATE(), 1)'
      : 'SELECT sum(gehalt) AS max FROM zeiten WHERE ahid = ? AND LOWER(ahmax) <> "student" AND datum BETWEEN ? AND CURDATE()';
    const qry = await query(conn, sql, [id, firstDayMonth]);

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
});

export default router;
