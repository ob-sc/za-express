import { RequestHandler } from 'express';
import { OnboardingStation, StationName } from '../../types/results';
import { onboarding } from '../../sql';
import { notEmptyString } from '../../util/helper';
import { onbNeuMail, onbFreigabeMail, statwMail, poswMail } from './mail';
import status from './status';

export const alleMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<OnboardingStation>(onboarding.selectWithStation);

    await close();

    // versteckte zeilen für nicht admin und nicht ersteller raus
    // rückwärts damit index richtig bleibt
    let i = qry.results.length;
    while (i--) {
      if (
        qry.results[i].anzeigen === false &&
        req.session.user?.username !== qry.results[i].ersteller &&
        req.session.user?.admin !== true
      )
        qry.results.splice(i, 1);
    }
    res.okmsg(qry.results);
  }, close);
};

export const neuerMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const ersteller = req.session.user?.username;
    const data = { ersteller, ...req.body };

    const sql = 'INSERT INTO onboarding SET ?';
    const qry = await query(sql, data);

    const sql2 = 'SELECT name FROM stationen WHERE id=?';
    const qry2 = await query<StationName>(sql2, [data.ort]);
    await close();

    await onbFreigabeMail({
      ...data,
      id: qry.id,
      station_name: qry2.results[0].name,
    });
    res.okmsg();
  }, close);
};

export const freigabe: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.body;

  await res.catchError(async () => {
    const sql = 'UPDATE onboarding SET anzeigen=1 WHERE id=?';
    await query(sql, [id]);

    const qry2 = await query<OnboardingStation>(onboarding.selectWithStation, [
      id,
    ]);
    await close();

    await onbNeuMail(qry2.results[0]);
    res.okmsg();
  }, close);
};

export const getMa: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = res.connectDB();

    const st = await status(query, id);

    await close();

    if (st !== null) res.okmsg(res, status);
    else res.errmsg('Status Query ist leer');
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

    await status(conn, id);

    await close();

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

    await status(query, id);

    await close();

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
    await close();

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
    await close();

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
    await close();

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
    await close();

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
    await close();

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
