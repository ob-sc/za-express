import { RequestHandler } from 'express';
import { aushilfen } from '../../sql';
import { Aushilfen } from '../../types/database';

export const getAushilfen: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<Aushilfen>(aushilfen.selectNotPassive);
    await close();

    res.okmsg(qry.results);
  }, close);
};
