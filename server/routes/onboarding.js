import express from 'express';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';
import { errmsg, okmsg } from '../util/response.js';

const router = express.Router();

router.use(auth);

// alle ma
router.get('', async (req, res) => {
  const conn = await connection();
  const sql = 'SELECT * FROM onboarding';

  const selectAll = await query(conn, sql);
  conn.release();

  okmsg(res, selectAll.result);
});

// neuer ma
router.post('', async (req, res, next) => {
  try {
    const {
      eintritt,
      vorname,
      nachname,
      ort,
      position,
      anforderungen,
    } = req.body;

    const ersteller = req.session.user.username;

    const conn = await connection();
    const sql =
      'INSERT INTO onboarding (ersteller,eintritt,vorname,nachname,ort,position,anforderungen) VALUES (?,?,?,?,?,?,?)';

    const createNewMA = await query(conn, sql, [
      ersteller,
      eintritt,
      vorname,
      nachname,
      ort,
      position,
      anforderungen,
    ]);
    conn.release();

    if (createNewMA.isUpdated) okmsg(res);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

export default router;
