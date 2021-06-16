import { RequestHandler } from 'express';
import sqlStrings from '../../sql';
import { MaxResult, ZeitenMax } from '../../../za-types/server/results';

export const selectMax: RequestHandler = async (req, res) => {
  const { query, close } = res.database();

  await res.catchError(async () => {
    const { id, status, firstDayMonth } = req.body;
    const isStudent = status.toLowerCase() === 'student';

    const sql = isStudent ? sqlStrings.zeiten.selMaxStudentID : sqlStrings.zeiten.selMaxID;
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
