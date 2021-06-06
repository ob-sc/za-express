import { RequestHandler } from 'express';
import { Aushilfen } from '../../types/database';

export const getAushilfen: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const sql =
      "SELECT * FROM aushilfen WHERE status <> 'passiv' ORDER BY station, nachname";
    const qry = await query<Aushilfen>(sql);
    await close();

    res.okmsg(qry.results);
  }, close);
};
