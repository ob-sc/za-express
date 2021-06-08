import { RequestHandler } from 'express';
import { OnboardingStation, StationName } from '../../../types/results';
import {
  OnbFreigabeMailData,
  OnbPosWMailData,
  StatWMailData,
} from '../../../types/mail';
import { onboardingSql, stationenSql } from '../../sql';
import { notEmptyString } from '../../util/helper';
import { onbNeuMail, onbFreigabeMail, statwMail, poswMail } from './mail';
import status from './status';

const {
  selectWithStation,
  insert,
  updAnzeigen,
  updDomain,
  updBitrix,
  updCrent,
  updDocuware,
  updQlik,
  updHardware,
  updNetwork,
} = onboardingSql;

export const alleMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<OnboardingStation>(selectWithStation);
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
    // todo type von req.body (gibt es schon als requests?)
    const data = { ersteller, ...req.body };

    const qry = await query(insert, data);

    const qry2 = await query<StationName>(stationenSql.selectName, [
      data.station,
    ]);
    await close();

    const mailData: OnbFreigabeMailData = {
      ...data,
      id: qry.id,
      station_name: qry2.results[0].name,
    };

    await onbFreigabeMail(mailData);
    res.okmsg();
  }, close);
};

export const freigabe: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.body;

  await res.catchError(async () => {
    await query(updAnzeigen, [id]);

    const qry2 = await query<OnboardingStation>(selectWithStation, [id]);
    await close();

    const [onboardingStation] = qry2.results;

    await onbNeuMail(onboardingStation);
    res.okmsg();
  }, close);
};

export const getMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.params;

  await res.catchError(async () => {
    const maStatus = await status(query, id);
    await close();

    if (maStatus !== null) res.okmsg(maStatus);
    else res.errmsg('Status Query ist leer');
  }, close);
};

const updateDomain: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, domain } = req.body;
    if (domain === undefined) return next();

    const qry = await query(updDomain, [domain, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
};

const updateBitrix: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, bitrix } = req.body;
    if (bitrix === undefined) return next();

    const qry = await query(updBitrix, [bitrix, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
};

const updateCrent: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, crent } = req.body;
    if (crent === undefined) return next();

    const qry = await query(updCrent, [crent, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
};

const updateDocuware: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, docuware } = req.body;
    if (docuware === undefined) return next();

    const qry = await query(updDocuware, [docuware, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
};

const updateQlik: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, qlik } = req.body;
    if (qlik === undefined) return next();

    const qry = await query(updQlik, [qlik, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
};

const updateHardware: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, hardware } = req.body;
    if (hardware === undefined) return next();

    const qry = await query(updHardware, [hardware, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
};

const updateNetwork: RequestHandler = async (req, res, next) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, network } = req.body;
    if (network === undefined) return next();

    const qry = await query(updNetwork, [network, id]);

    await status(query, id);

    await close();

    if (qry.isUpdated === true) res.okmsg();
    else res.errmsg();
  }, close);
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

export const stationsWechsel: RequestHandler = async (req, res) => {
  await res.catchError(async () => {
    const { name, date, station, docuware } = req.body;

    const dw = notEmptyString(docuware) ? docuware : undefined;

    const mailData: StatWMailData = {
      name,
      date,
      station,
      docuware: dw,
      creator: req.session.user?.username ?? '',
    };
    await statwMail(mailData);

    res.okmsg();
  });
};

export const positionsWechsel: RequestHandler = async (req, res) => {
  await res.catchError(async () => {
    const { name, date, position } = req.body;

    const mailData: OnbPosWMailData = {
      name,
      date,
      position,
      creator: req.session.user?.username ?? '',
    };

    await poswMail(mailData);

    res.okmsg();
  });
};
