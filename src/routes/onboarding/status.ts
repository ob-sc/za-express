import { Response } from 'express';
import { PoolConnection } from 'mysql';
import { onbDoneMail } from './mail.js';
import {
  getValue,
  isRequested,
  isDone,
  hardwareAnf,
  networkAnf,
  suggestion,
} from './statusHelper';

const status: (res: Response, conn: PoolConnection, id: number) => void = (
  res,
  conn,
  id
) => {
  const sql =
    'SELECT onb.*, stat.name AS station_name FROM onboarding AS onb JOIN stationen AS stat ON onb.ort = stat.id WHERE onb.id=?';
  const qry = res.query(conn, sql, [id]);

  const data = qry?.result[0];
  if (qry?.isEmpty === true) return null;

  const anforderungen = JSON.parse(data.anforderungen);

  const crent =
    typeof data.crent === 'string' && data.crent[0] === '{'
      ? JSON.parse(data.crent)
      : { user: false, pn: false, kasse: false };

  const hardware = hardwareAnf(anforderungen);
  const network = networkAnf(anforderungen);

  const suggestions = suggestion(data.vorname, data.nachname);

  const status = [
    {
      name: 'domain',
      value: getValue(data.domain),
      done: isDone(data.domain),
      label: 'Citrix',
      required: true,
      suggestion: suggestions.domain,
    },
    {
      name: 'mail',
      value: getValue(data.domain) ? `${data.domain}@starcar.de` : false,
      done: isDone(data.domain),
      label: 'E-Mail',
      required: true,
    },
    {
      name: 'crentuser',
      value: getValue(crent.user),
      done: isDone(crent.user),
      label: 'C-Rent Benutzer',
      required: true,
      stations: anforderungen.crentstat,
      suggestion: suggestions.crent,
    },
    {
      name: 'crentpn',
      value: getValue(crent.pn),
      done: isDone(crent.pn),
      label: 'C-Rent PN',
      required: true,
    },
    {
      name: 'crentkasse',
      value: getValue(crent.kasse),
      done: isDone(crent.kasse),
      label: 'Kassenkonto',
      required: isRequested(anforderungen.kasse),
    },
    {
      name: 'bitrix',
      value: getValue(data.bitrix),
      done: isDone(data.bitrix),
      label: 'Bitrix',
      required: true,
    },
    {
      name: 'docuware',
      value: getValue(data.docuware),
      done: isDone(data.docuware),
      label: 'Docuware',
      required: isRequested(anforderungen.docuware),
      workflow: anforderungen.workflow,
    },
    {
      name: 'qlik',
      value: getValue(data.qlik),
      done: isDone(data.qlik),
      label: 'Qlik',
      required: isRequested(anforderungen.qlik),
      stations: anforderungen.qlikstat,
      apps: anforderungen.qlikapps,
    },
    {
      name: 'hardware',
      value: getValue(data.hardware),
      done: isDone(data.hardware),
      label: 'Hardware',
      required: hardware.required,
      array: hardware.array,
    },
    {
      name: 'network',
      value: getValue(data.network),
      done: isDone(data.network),
      label: 'Netzwerk',
      required: network.required,
      array: network.array,
    },
  ];

  // wenn der MA in der DB noch status 0 hatte, jetzt also erst fertig ist
  if (data.status === 0) {
    let isNotDone = false;
    for (const item of status) {
      if (item.required === true && item.done !== true) {
        isNotDone = true;
        break;
      }
    }

    // wenn alle .done === true
    if (isNotDone === false) {
      const sql2 = 'UPDATE onboarding SET status=1 WHERE id=?';
      const qry2 = res.query(conn, sql2, [id]);
      if (qry2.isUpdated === true) onbDoneMail({ ...data, status });
    }
  }

  // data.ort = stationsnummer, wert aus form (arbeitsort)
  return {
    id: data.id,
    anzeigen: data.anzeigen === 1,
    anforderungen: status,
    anrede: data.anrede,
    vorname: data.vorname,
    nachname: data.nachname,
    eintritt: data.eintritt,
    station: data.ort,
    ort: data.station_name,
    position: data.position,
    reg_date: data.reg_date,
  };
};

export default status;
