import { RequestHandler } from 'express';
import { Angemeldet } from '../../types/database';
import { AngemeldetName } from '../../types/results';
import { angemeldetSql } from '../../sql';
import { AnmeldenRequest } from '../../types/requests';

const { selectID, insert, selectWithName, deleteID } = angemeldetSql;

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
    const qry = await query<Angemeldet>(selectID, [ahid]);

    if (qry.isEmpty === false) {
      await close();
      return res.errmsg('Aushilfe ist bereits angemeldet', 409);
    }

    await query(insert, anmeldung);
    await close();

    res.okmsg();
  }, close);
};

export const getAnmeldungen: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<AngemeldetName>(selectWithName, [
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
    await query(deleteID, [id]);
    await close();

    res.okmsg();
  }, close);
};
