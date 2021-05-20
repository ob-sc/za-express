import express from 'express';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import { onbNeuMail } from '../util/mail.js';
import query from '../util/query.js';
import { errmsg, okmsg } from '../util/response.js';
import checkStatus from '../util/status.js';

const router = express.Router();

router.use(auth);

// alle ma
router.get('', async (req, res, next) => {
  try {
    const conn = await connection();

    const sql =
      'SELECT id,status,ersteller,vorname,nachname,eintritt,ort FROM onboarding ORDER BY status, id DESC';
    const qry = await query(conn, sql);
    conn.release();

    okmsg(res, qry.result);
  } catch (err) {
    next(err);
  }
});

// neuer ma
router.post('', async (req, res, next) => {
  try {
    const ersteller = req.session.user.username;

    const data = { ersteller, ...req.body };

    const conn = await connection();

    const sql = 'INSERT INTO onboarding SET ?';
    const qry = await query(conn, sql, data);

    const sql2 = 'SELECT name FROM stationen WHERE id=?';
    const qry2 = await query(conn, sql2, [data.ort]);

    conn.release();

    if (qry.isUpdated) {
      onbNeuMail({ ...data, id: qry.id, ort: qry2.result[0].name });
      okmsg(res);
    } else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// get mit id
router.get('/ma/:id', async (req, res, next) => {
  try {
    const conn = await connection();

    const sql = 'SELECT * FROM onboarding WHERE id=?';
    const qry = await query(conn, sql, [req.params.id]);
    conn.release();

    if (!qry.isEmpty) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update domain
router.put('/domain', async (req, res, next) => {
  try {
    const { id, domain } = req.body;
    const conn = await connection();

    const sql = 'UPDATE onboarding SET domain=? WHERE id=?';
    const qry = await query(conn, sql, [domain, id]);

    const status = await checkStatus(conn, id);

    conn.release();

    const result = { status, updated: qry.result[0] };

    if (qry.isUpdated) okmsg(res, result);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update bitrix
router.put('/bitrix', async (req, res, next) => {
  try {
    const { id, bitrix } = req.body;
    const conn = await connection();
    const sql = 'UPDATE onboarding SET bitrix=? WHERE id=?';

    const qry = await query(conn, sql, [bitrix, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update crent
router.put('/crent', async (req, res, next) => {
  try {
    const { id, crent } = req.body;
    const conn = await connection();
    const sql = 'UPDATE onboarding SET crent=? WHERE id=?';

    const qry = await query(conn, sql, [JSON.stringify(crent), id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update docuware
router.put('/docuware', async (req, res, next) => {
  try {
    const { id, docuware } = req.body;
    const conn = await connection();
    const sql = 'UPDATE onboarding SET docuware=? WHERE id=?';

    const qry = await query(conn, sql, [docuware, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update qlik
router.put('/qlik', async (req, res, next) => {
  try {
    const { id, qlik } = req.body;
    const conn = await connection();
    const sql = 'UPDATE onboarding SET qlik=? WHERE id=?';

    const qry = await query(conn, sql, [qlik, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update hardware
router.put('/hardware', async (req, res, next) => {
  try {
    const { id, hardware } = req.body;
    const conn = await connection();
    const sql = 'UPDATE onboarding SET hardware=? WHERE id=?';

    const qry = await query(conn, sql, [hardware, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// update vpn
router.put('/vpn', async (req, res, next) => {
  try {
    const { id, vpn } = req.body;
    const conn = await connection();
    const sql = 'UPDATE onboarding SET vpn=? WHERE id=?';

    const qry = await query(conn, sql, [vpn, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qry.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

export default router;
