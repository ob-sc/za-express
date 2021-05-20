import { onbDoneMail } from './mail.js';
import query from './query.js';

const checkStatus = async (conn, id) => {
  const isRequested = (value) => value !== false && value !== '';
  const isDone = (value, requested = false) =>
    // wenn nicht angefordert => true, nur wenn requested auch gegeben ist
    // wenn der wert aus dem sql result nicht null ist auch
    !isRequested(requested) || value !== null;

  const sql = 'SELECT * FROM onboarding WHERE id=?';
  const qry = await query(conn, sql, [id]);

  const [result] = qry.result;
  const anf = JSON.parse(result.anforderungen);
  const crent = result.crent === null ? null : JSON.parse(result.crent);
  const domain =
    result.domain === null || result.domain === '' ? null : result.domain;
  const mail = domain !== null ? `${result.domain}@starcar.de` : null;

  const status = [
    {
      value: result.domain,
      done: isDone(result.domain),
      label: 'Citrix',
      required: true,
    },
    {
      value: mail,
      done: isDone(result.domain),
      label: 'E-Mail',
      required: true,
    },
    {
      value: result.bitrix,
      done: isDone(result.bitrix),
      label: 'Bitrix',
      required: true,
    },
    {
      value: result.docuware,
      done: isDone(result.docuware, anf.docuware),
      label: 'Docuware',
      required: isRequested(anf.docuware),
    },
    {
      value: result.qlik,
      done: isDone(result.qlik, anf.qlik),
      label: 'Qlik',
      required: isRequested(anf.qlik),
    },
    {
      value: result.hardware,
      done: isDone(result.hardware, anf.hardware),
      label: 'Hardware',
      required: isRequested(anf.hardware),
    },
    {
      value: result.vpn,
      done: isDone(result.vpn, anf.vpn),
      label: 'VPN',
      required: isRequested(anf.vpn),
    },
    {
      value: crent.user,
      done: isDone(crent.user),
      label: 'C-Rent Benutzer',
      required: true,
    },
    {
      value: crent.pn,
      done: isDone(crent.pn),
      label: 'C-Rent Personalnummer',
      required: true,
    },
    {
      value: crent.kasse,
      done: isDone(crent.kasse, anf.kasse),
      label: 'Kassenkonto',
      required: isRequested(anf.kasse),
    },
  ];

  // wenn der MA in der DB noch status 0 hatte, jetzt also erst fertig ist
  if (result.status === 0) {
    let isNotDone = false;
    for (const item of status) {
      if (item.done !== true) {
        isNotDone = true;
        break;
      }
    }

    if (isNotDone === false) {
      const sql2 = 'UPDATE onboarding SET status=1 WHERE id=?';
      const qry2 = await query(conn, sql2, [id]);
      if (qry2.isUpdated === true) onbDoneMail({ ...result, status });
    }
  }

  return status;
};

export default checkStatus;

/*
{
  http-api-0  |   status: 0,
  http-api-0  |   domain: 'asd',
  http-api-0  |   bitrix: null,
  http-api-0  |   docuware: null,
  http-api-0  |   crent: '{"user":"asd","pn":"d","kasse":""}',
  http-api-0  |   qlik: null,
  http-api-0  |   hardware: null,
  http-api-0  |   vpn: null
  http-api-0  | }
  */
