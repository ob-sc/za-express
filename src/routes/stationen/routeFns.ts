import { RequestHandler } from 'express';
import { stationenSql } from '../../sql';
import { Stationen } from '../../../za-types/server/database';
import { StationOptions } from '../../../za-types/server/results';

const { selectAsOptions, selectStationID } = stationenSql;

export const selectOptions: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const qry = await query<StationOptions>(selectAsOptions);
    await close();

    res.okmsg(qry.results);
  }, close);
};

export const signatur: RequestHandler = async (req, res) => {
  const { query, close } = res.database();
  const { id } = req.params;

  await res.catchError(async () => {
    const qry = await query<Stationen>(selectStationID, [id]);
    await close();

    const [stations] = qry.results;

    res.okmsg(stations);
  }, close);
};
