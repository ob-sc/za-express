import express from 'express';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import { onbNeuMail } from '../util/mail.js';
import query from '../util/query.js';
import { errmsg, okmsg } from '../util/response.js';
import maStatus from '../util/onbStatus.js';

const router = express.Router();

router.use(auth);

// alle ma
router.get('', async (req, res, next) => {
  try {
    const conn = await connection();

    const sql =
      'SELECT o.id,o.status,o.ersteller,o.vorname,o.nachname,o.eintritt,o.anzeigen,s.name AS ort FROM onboarding AS o JOIN stationen AS s ON s.id = o.ort ORDER BY status, id DESC';
    const qry = await query(conn, sql);

    conn.release();

    const { result } = qry;

    // versteckte zeilen für nicht admin und nicht ersteller raus
    // rückwärts damit index richtig bleibt
    let i = result.length;
    while (i--) {
      if (
        result[parseInt(i)].anzeigen === 0 &&
        req.session.user.username !== result[parseInt(i)].ersteller &&
        req.session.user.admin !== true
      )
        result.splice(i, 1);
    }

    okmsg(res, result);
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

// freigabe von perso
router.get('/freigabe/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await connection();

    const sql = 'UPDATE onboarding SET anzeigen=1 WHERE id=?';
    const qry = await query(conn, sql, [id]);

    conn.release();

    if (qry.isUpdated) okmsg(res);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// get ma mit id
router.get('/ma/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await connection();

    const status = await maStatus(conn, id);

    conn.release();

    if (status !== null) okmsg(res, status);
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

    await maStatus(conn, id);

    conn.release();

    const result = qry.result[0];

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

    await maStatus(conn, id);

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
