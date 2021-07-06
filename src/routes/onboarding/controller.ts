import { RequestHandler } from 'express';
import { OnboardingStation, StationName } from '../../../za-types/server/results';
import { NeuerMaForm } from '../../../za-types/server/onboarding';
import { OnbFreigabeMailData, OnbPosWMailData, StatWMailData } from '../../../za-types/server/mail';
import sqlStrings from '../../sql';
import { notEmptyString, onboardingAuthResult } from '../../util/helper';
import { onbFreigabeMail, onbHardwareMail, onbNeuMail, poswMail, statwMail } from './mail';
import status from './status';
import { hardwareAnf } from './statusHelper';

export const alleMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { user } = req.session;

  await res.catchError(async () => {
    const qry = await query<OnboardingStation>(sqlStrings.onboarding.selJoinStation);
    await close();

    const authedMa = onboardingAuthResult(user, qry.results, res.authStation);

    res.okmsg(authedMa);
  }, close);
};

export const neuerMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const ersteller = req.session.user?.username ?? '';
    const values: NeuerMaForm = req.body;
    const data = { ersteller, ...values };

    const qry = await query(sqlStrings.onboarding.ins, data);

    const qry2 = await query<StationName>(sqlStrings.stationen.selName, [data.station]);
    await close();

    const [statname] = qry2.results;

    const mailData: OnbFreigabeMailData = {
      ...data,
      id: qry.id ?? 0,
      station_name: statname.name,
    };

    await onbFreigabeMail(mailData);
    res.okmsg();
  }, close);
};

export const freigabe: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.body;

  await res.catchError(async () => {
    const qry2 = await query<OnboardingStation>(sqlStrings.onboarding.selJoinStationID, [id]);
    const [onboardingStation] = qry2.results;
    if (onboardingStation.anzeigen === true)
      return res.errmsg('Mitarbeiter ist schon freigegeben', 400);

    await query(sqlStrings.onboarding.updAnzeigen, [id]);

    await close();

    await onbNeuMail(onboardingStation);

    const anf = JSON.parse(onboardingStation.anforderungen);
    const { array } = hardwareAnf(anf);

    if (array.length !== 0) {
      await onbHardwareMail(onboardingStation);
    }
    res.okmsg();
  }, close);
};

export const getMa: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const id = Number(req.params.id);

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

    const qry = await query(sqlStrings.onboarding.updDomain, [domain, id]);

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

    const qry = await query(sqlStrings.onboarding.updBitrix, [bitrix, id]);

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

    const qry = await query(sqlStrings.onboarding.updCrent, [crent, id]);

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

    const qry = await query(sqlStrings.onboarding.updDocuware, [docuware, id]);

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

    const qry = await query(sqlStrings.onboarding.updQlik, [qlik, id]);

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

    const qry = await query(sqlStrings.onboarding.updNetwork, [network, id]);

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
