import { RequestHandler } from 'express';
import sqlStrings from '../../sql';
import { Stationen } from '../../../za-types/server/database';
import { StationOptions } from '../../../za-types/server/results';

export const selectOptions: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<StationOptions>(sqlStrings.stationen.selOptions);
    await close();

    res.okmsg(qry.results);
  }, close);
};

export const signatur: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.params;

  await res.catchError(async () => {
    const qry = await query<Stationen>(sqlStrings.stationen.selID, [id]);
    await close();

    const [stations] = qry.results;

    res.okmsg(stations);
  }, close);
};
