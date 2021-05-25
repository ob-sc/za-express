import connection from '../../util/connection.js';
import { onbNeuMail, onbFreigabeMail } from '../../util/mail.js';
import query from '../../util/query.js';
import { errmsg, okmsg } from '../../util/response.js';
import maStatus from './status.js';

export const alleMa = async (req, res, next) => {
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
};

export const neuerMa = async (req, res, next) => {
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
      onbFreigabeMail({ ...data, id: qry.id, ort: qry2.result[0].name });
      okmsg(res);
    } else errmsg(res);
  } catch (err) {
    next(err);
  }
};

export const freigabe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = await connection();

    const sql = 'UPDATE onboarding SET anzeigen=1 WHERE id=?';
    const qry = await query(conn, sql, [id]);

    const sql2 =
      'SELECT o.id,o.ersteller,o.vorname,o.nachname,o.eintritt,o.position,s.name AS ort FROM onboarding AS o JOIN stationen AS s ON s.id = o.ort ORDER BY status, id DESC';
    const qry2 = await query(conn, sql2, [id]);

    conn.release();

    if (!qry2.isEmpty) onbNeuMail(qry2.result[0]);

    if (qry.isUpdated) okmsg(res);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

export const getMa = async (req, res, next) => {
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
};

const updateDomain = async (req, res, next) => {
  try {
    const { id, domain } = req.body;
    if (domain === undefined) return next();

    const conn = await connection();

    const sql = 'UPDATE onboarding SET domain=? WHERE id=?';
    const qry = await query(conn, sql, [domain, id]);

    await maStatus(conn, id);

    conn.release();

    if (qry.isUpdated) okmsg(res, domain);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

const updateBitrix = async (req, res, next) => {
  try {
    const { id, bitrix } = req.body;
    if (bitrix === undefined) return next();

    const conn = await connection();

    const sql = 'UPDATE onboarding SET bitrix=? WHERE id=?';
    const qry = await query(conn, sql, [bitrix, id]);

    await maStatus(conn, id);

    conn.release();

    if (qry.isUpdated) okmsg(res, bitrix);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

const updateCrent = async (req, res, next) => {
  try {
    const { id, crent } = req.body;
    if (crent === undefined) return next();

    const conn = await connection();
    const sql = 'UPDATE onboarding SET crent=? WHERE id=?';

    const qry = await query(conn, sql, [crent, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, crent);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

const updateDocuware = async (req, res, next) => {
  try {
    const { id, docuware } = req.body;
    if (docuware === undefined) return next();

    const conn = await connection();
    const sql = 'UPDATE onboarding SET docuware=? WHERE id=?';

    const qry = await query(conn, sql, [docuware, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, docuware);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

const updateQlik = async (req, res, next) => {
  try {
    const { id, qlik } = req.body;
    if (qlik === undefined) return next();

    const conn = await connection();
    const sql = 'UPDATE onboarding SET qlik=? WHERE id=?';

    const qry = await query(conn, sql, [qlik, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, qlik);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

const updateHardware = async (req, res, next) => {
  try {
    const { id, hardware } = req.body;
    if (hardware === undefined) return next();

    const conn = await connection();
    const sql = 'UPDATE onboarding SET hardware=? WHERE id=?';

    const qry = await query(conn, sql, [hardware, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, hardware);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

const updateVPN = async (req, res, next) => {
  try {
    const { id, vpn } = req.body;
    if (vpn === undefined) return next();

    const conn = await connection();
    const sql = 'UPDATE onboarding SET vpn=? WHERE id=?';

    const qry = await query(conn, sql, [vpn, id]);
    conn.release();

    if (qry.isUpdated) okmsg(res, vpn);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
};

export const updateMitarbeiter = [
  updateDomain,
  updateBitrix,
  updateCrent,
  updateDocuware,
  updateQlik,
  updateHardware,
  updateVPN,
];
