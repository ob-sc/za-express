import { RequestHandler } from 'express';
import { angemeldet } from '../../sql';
import { Angemeldet, AngemeldetName } from '../../types/database';

const { selectID, insert, selectWithName, deleteID } = angemeldet;

export const anmelden: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  const { ahid, date, start } = req.body;

  const anmeldung = {
    ahid,
    date,
    start,
    station: req.session.user?.station,
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
