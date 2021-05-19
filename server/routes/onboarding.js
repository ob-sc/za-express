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
      'SELECT id,status,ersteller,vorname,nachname,eintritt,ort FROM onboarding';

    const selectAll = await query(conn, sql);
    conn.release();

    okmsg(res, selectAll.result);
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

    const createNewMA = await query(conn, sql, data);

    conn.release();

    if (createNewMA.isUpdated) {
      onbNeuMail(createNewMA, data);
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

    const selectOne = await query(conn, sql, [req.params.id]);
    conn.release();

    if (!selectOne.isEmpty) okmsg(res, selectOne.result[0]);
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

    const putDomain = await query(conn, sql, [domain, id]);

    const status = await checkStatus(conn, id);

    conn.release();

    if (putDomain.isUpdated) okmsg(res, putDomain.result[0]);
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

    const putBitrix = await query(conn, sql, [bitrix, id]);
    conn.release();

    if (putBitrix.isUpdated) okmsg(res, putBitrix.result[0]);
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

    const putCrent = await query(conn, sql, [JSON.stringify(crent), id]);
    conn.release();

    if (putCrent.isUpdated) okmsg(res, putCrent.result[0]);
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

    const putDocuware = await query(conn, sql, [docuware, id]);
    conn.release();

    if (putDocuware.isUpdated) okmsg(res, putDocuware.result[0]);
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

    const putQlik = await query(conn, sql, [qlik, id]);
    conn.release();

    if (putQlik.isUpdated) okmsg(res, putQlik.result[0]);
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

    const putHardware = await query(conn, sql, [hardware, id]);
    conn.release();

    if (putHardware.isUpdated) okmsg(res, putHardware.result[0]);
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

    const putVPN = await query(conn, sql, [vpn, id]);
    conn.release();

    if (putVPN.isUpdated) okmsg(res, putVPN.result[0]);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

export default router;
