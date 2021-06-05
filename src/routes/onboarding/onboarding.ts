import { notEmptyString } from '../../util/helper.js';
import { onbNeuMail, onbFreigabeMail, statwMail, poswMail } from './mail.js';
import maStatus from './status.js';

export const alleMa = (req, res, next) => {
  try {
    const conn = res.connectDB();

    const sql =
      'SELECT o.id,o.status,o.ersteller,o.vorname,o.nachname,o.eintritt,o.anzeigen,s.name AS ort FROM onboarding AS o JOIN stationen AS s ON s.id = o.ort ORDER BY status, id DESC';
    const { result } = res.query(conn, sql);

    conn.release();

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
    res.okmsg(res, result);
  } catch (err) {
    next(err);
  }
};

export const neuerMa = (req, res, next) => {
  try {
    const ersteller = req.session.user.username;

    const data = { ersteller, ...req.body };

    const conn = res.connectDB();

    const sql = 'INSERT INTO onboarding SET ?';
    const qry = res.query(conn, sql, data);

    const sql2 = 'SELECT name FROM stationen WHERE id=?';
    const qry2 = res.query(conn, sql2, [data.ort]);

    conn.release();

    if (qry.isUpdated === true) {
      onbFreigabeMail({ ...data, id: qry.id, ort: qry2.result[0].name });
      res.res.okmsg();
    } else res.errmsg();
  } catch (err) {
    next(err);
  }
};

export const freigabe = (req, res, next) => {
  try {
    const { id } = req.body;
    const conn = res.connectDB();

    const sql = 'UPDATE onboarding SET anzeigen=1 WHERE id=?';
    const qry = res.query(conn, sql, [id]);

    const sql2 =
      'SELECT o.id,o.ersteller,o.vorname,o.nachname,o.eintritt,o.position,s.name AS ort FROM onboarding AS o JOIN stationen AS s ON s.id = o.ort ORDER BY status, id DESC';
    const qry2 = res.query(conn, sql2, [id]);

    conn.release();

    if (qry2.isEmpty === false) onbNeuMail(qry2.result[0]);

    if (qry.isUpdated === true) res.res.okmsg();
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

export const getMa = (req, res, next) => {
  try {
    const { id } = req.params;
    const conn = res.connectDB();

    const status = await maStatus(conn, id);

    conn.release();

    if (status !== null) res.okmsg(res, status);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateDomain = (req, res, next) => {
  try {
    const { id, domain } = req.body;
    if (domain === undefined) return next();

    const conn = res.connectDB();

    const sql = 'UPDATE onboarding SET domain=? WHERE id=?';
    const qry = res.query(conn, sql, [domain, id]);

    await maStatus(conn, id);

    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, domain);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateBitrix = (req, res, next) => {
  try {
    const { id, bitrix } = req.body;
    if (bitrix === undefined) return next();

    const conn = res.connectDB();

    const sql = 'UPDATE onboarding SET bitrix=? WHERE id=?';
    const qry = res.query(conn, sql, [bitrix, id]);

    await maStatus(conn, id);

    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, bitrix);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateCrent = (req, res, next) => {
  try {
    const { id, crent } = req.body;
    if (crent === undefined) return next();

    const conn = res.connectDB();
    const sql = 'UPDATE onboarding SET crent=? WHERE id=?';

    const qry = res.query(conn, sql, [crent, id]);
    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, crent);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateDocuware = (req, res, next) => {
  try {
    const { id, docuware } = req.body;
    if (docuware === undefined) return next();

    const conn = res.connectDB();
    const sql = 'UPDATE onboarding SET docuware=? WHERE id=?';

    const qry = res.query(conn, sql, [docuware, id]);
    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, docuware);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateQlik = (req, res, next) => {
  try {
    const { id, qlik } = req.body;
    if (qlik === undefined) return next();

    const conn = res.connectDB();
    const sql = 'UPDATE onboarding SET qlik=? WHERE id=?';

    const qry = res.query(conn, sql, [qlik, id]);
    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, qlik);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateHardware = (req, res, next) => {
  try {
    const { id, hardware } = req.body;
    if (hardware === undefined) return next();

    const conn = res.connectDB();
    const sql = 'UPDATE onboarding SET hardware=? WHERE id=?';

    const qry = res.query(conn, sql, [hardware, id]);
    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, hardware);
    else res.errmsg();
  } catch (err) {
    next(err);
  }
};

const updateNetwork = (req, res, next) => {
  try {
    const { id, network } = req.body;
    if (network === undefined) return next();

    const conn = res.connectDB();
    const sql = 'UPDATE onboarding SET network=? WHERE id=?';

    const qry = res.query(conn, sql, [network, id]);
    conn.release();

    if (qry.isUpdated === true) res.okmsg(res, network);
    else res.errmsg();
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
  updateNetwork,
];

export const stationsWechsel = (req, res, next) => {
  try {
    const { name, date, station, docuware } = req.body;

    const dw = notEmptyString(docuware) ? docuware : undefined;

    await statwMail(name, date, station, dw, req.session.user.username);

    res.res.okmsg();
  } catch (err) {
    next(err);
  }
};

export const positionsWechsel = (req, res, next) => {
  try {
    const { name, date, position } = req.body;

    await poswMail(name, date, position, req.session.user.username);

    res.res.okmsg();
  } catch (err) {
    next(err);
  }
};
