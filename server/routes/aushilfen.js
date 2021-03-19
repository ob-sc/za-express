import express from 'express';

import { okmsg } from '../util/response.js';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';

const router = express.Router();

router.use(auth);

router.get('', async (req, res, next) => {
  try {
    const conn = await connection();
    const allAushilfenSQL =
      "SELECT * FROM aushilfen WHERE status <> 'passiv' ORDER BY nachname";
    const { result } = await query(conn, allAushilfenSQL);

    okmsg(res, result);
    conn.release();
  } catch (err) {
    next(err);
  }
});

export default router;
