import { RequestHandler } from 'express';
import { Angemeldet } from '../../../za-types/server/database';
import { AngemeldetName } from '../../../za-types/server/results';
import sqlStrings from '../../sql';
import { AnmeldenRequest } from '../../../za-types/server/requests';

export const anmelden: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  const { ahid, date, start } = req.body;

  const anmeldung: AnmeldenRequest = {
    ahid,
    date,
    start,
    station: req.session.user?.station ?? 0,
  };

  await res.catchError(async () => {
    const qry = await query<Angemeldet>(sqlStrings.angemeldet.selId, [ahid]);

    if (qry.isEmpty === false) {
      await close();
      return res.errmsg('Aushilfe ist bereits angemeldet', 409);
    }

    await query(sqlStrings.angemeldet.ins, anmeldung);
    await close();

    res.okmsg();
  }, close);
};

export const getAnmeldungen: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<AngemeldetName>(sqlStrings.angemeldet.selJoinAh, [
      req.session.user?.currentStation,
    ]);
    await close();

    res.okmsg(qry.results);
  }, close);
};

export const deleteAnmeldung: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.body;

  await res.catchError(async () => {
    await query(sqlStrings.angemeldet.del, [id]);
    await close();

    res.okmsg();
  }, close);
};
