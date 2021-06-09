import { RequestHandler } from 'express';
import { aushilfenSql } from '../../sql';
import { Aushilfen } from '../../../za-types/server/database';

export const getAushilfen: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<Aushilfen>(aushilfenSql.selectNotPassive);
    await close();

    res.okmsg(qry.results);
  }, close);
};
