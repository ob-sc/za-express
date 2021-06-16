import { RequestHandler } from 'express';
import sqlStrings from '../../sql';
import { Aushilfen } from '../../../za-types/server/database';

export const getAushilfen: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<Aushilfen>(sqlStrings.aushilfen.sel);
    await close();

    res.okmsg(qry.results);
  }, close);
};
