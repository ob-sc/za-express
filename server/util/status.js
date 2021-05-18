import query from './query.js';

const checkStatus = async (conn, id) => {
  const sql =
    'SELECT status,anforderungen,domain,bitrix,docuware,crent,qlik,hardware,vpn FROM onboarding WHERE id=?';

  const qry = await query(conn, sql, [id]);

  const result = qry.result[0];

  const anforderungen = JSON.parse(result.anforderungen);

  console.log(anforderungen);
};

export default checkStatus;
