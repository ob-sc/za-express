import express from 'express';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';
import { errmsg, okmsg } from '../util/response.js';

const router = express.Router();

router.use(auth);

// alle ma
router.get('', async (req, res, next) => {
  try {
    const conn = await connection();
    const sql =
      'SELECT id,status,ersteller,vorname,nachname,eintritt,ort FROM onboarding';

    const selectAll = await query(conn, sql);
    conn.release();

    okmsg(res, selectAll.result);
  } catch (err) {
    next(err);
  }
});

// alle ma
router.get('/ma/:id', async (req, res, next) => {
  try {
    const conn = await connection();
    const sql = 'SELECT * FROM onboarding WHERE id=?';

    const selectOne = await query(conn, sql, [req.params.id]);
    conn.release();

    if (!selectOne.isEmpty) okmsg(res, selectOne.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// neuer ma
router.post('', async (req, res, next) => {
  try {
    const {
      eintritt,
      anrede,
      vorname,
      nachname,
      ort,
      position,
      anforderungen,
    } = req.body;

    const ersteller = req.session.user.username;

    const conn = await connection();
    const sql =
      'INSERT INTO onboarding (ersteller,anrede,eintritt,vorname,nachname,ort,position,anforderungen) VALUES (?,?,?,?,?,?,?,?)';

    const createNewMA = await query(conn, sql, [
      ersteller,
      anrede,
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
