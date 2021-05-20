import { onbDoneMail } from './mail.js';
import query from './query.js';

const checkStatus = async (conn, id) => {
  const getValue = (value) => (value === 1 ? '✓' : value);
  const isRequested = (value) =>
    value === true || (typeof value === 'string' && value !== '');
  const isDone = (value, requested = true) =>
    // wenn nicht angefordert => true, nur wenn requested auch gegeben ist
    // wenn der wert aus dem sql result nicht null ist auch
    isRequested(requested) === false || value !== null;

  const sql = 'SELECT * FROM onboarding WHERE id=?';
  const qry = await query(conn, sql, [id]);

  const [result] = qry.result;
  const anf = JSON.parse(result.anforderungen);
  const crent =
    result.crent === null
      ? { user: null, pn: null, kasse: null }
      : JSON.parse(result.crent);
  const domain =
    result.domain === null || result.domain === '' ? null : result.domain;
  const mail = domain !== null ? `${result.domain}@starcar.de` : null;

  const status = [
    {
      value: getValue(result.domain),
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
      value: getValue(result.bitrix),
      done: isDone(result.bitrix),
      label: 'Bitrix',
      required: true,
    },
    {
      value: getValue(result.docuware),
      done: isDone(result.docuware, anf.docuware),
      label: 'Docuware',
      required: isRequested(anf.docuware),
    },
    {
      value: getValue(result.qlik),
      done: isDone(result.qlik, anf.qlik),
      label: 'Qlik',
      required: isRequested(anf.qlik),
    },
    {
      value: getValue(result.hardware),
      done: isDone(result.hardware, anf.hardware),
      label: 'Hardware',
      required: isRequested(anf.hardware),
    },
    {
      value: getValue(result.vpn),
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
      label: 'C-Rent PN',
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

    // wenn alle .done === true
    if (isNotDone === false) {
      const sql2 = 'UPDATE onboarding SET status=1 WHERE id=?';
      const qry2 = await query(conn, sql2, [id]);
      if (qry2.isUpdated === true) onbDoneMail({ ...result, status });
    }
  }

  return status;
};

export default checkStatus;
