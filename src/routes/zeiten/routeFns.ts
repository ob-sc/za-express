import { RequestHandler } from 'express';
import { zeitenSql } from '../../sql';
import { MaxResult, ZeitenMax } from '../../types/results';

const { selectMaxID, selectMaxStudent } = zeitenSql;

export const selectMax: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, status, firstDayMonth } = req.body;
    const isStudent = status.toLowerCase() === 'student';

    const sql = isStudent ? selectMaxStudent : selectMaxID;
    const qry = await query<ZeitenMax>(sql, [id, firstDayMonth]);

    const result: MaxResult = {
      id,
      status: status.toLowerCase(),
      sum: qry.results[0].max,
    };
    res.okmsg(result);
    await close();
  }, close);
};
