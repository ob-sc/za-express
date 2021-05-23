import { onbDoneMail } from '../../util/mail.js';
import query from '../../util/query.js';

// nicht empty string
const neStr = (value) => typeof value === 'string' && value !== '';

const getValue = (value) =>
  value === true || value === 1 ? true : neStr(value) ? value : false;

const isRequested = (value) => getValue(value) === true || neStr(value);

const isDone = (value) => value !== null;

const hardwareAnf = (anf) => {
  let required = false;
  const array = [];

  const pushHardware = (label, value) => {
    array.push({ label, value });
    required = true;
  };

  if (anf.handy === true) pushHardware('Handy', anf.handy);
  if (anf.laptop === true) pushHardware('Laptop', anf.laptop);
  if (anf.pc === true) pushHardware('Computer', anf.pc);
  if (neStr(anf.monitore)) pushHardware('Monitore', anf.monitore);
  if (anf.ipad === true) pushHardware('iPad', anf.ipad);
  if (neStr(anf.ipadspez)) pushHardware('iPad spez.', anf.ipadspez);
  if (anf.drucker === true) pushHardware('Drucker', anf.drucker);
  if (anf.tanken === true) pushHardware('Tankkarte', anf.tanken);
  if (neStr(anf.freigabe)) pushHardware('Freigabe', anf.freigabe);
  if (neStr(anf.sonstiges)) pushHardware('Sonstiges', anf.sonstiges);

  return {
    required,
    array,
  };
};

const status = async (conn, id) => {
  const sql =
    'SELECT onb.*, stat.name AS station_name FROM onboarding AS onb JOIN stationen AS stat ON onb.ort = stat.id WHERE onb.id=?';
  const qry = await query(conn, sql, [id]);

  const [data] = qry.result;
  if (qry.isEmpty === true) return null;

  const anforderungen = JSON.parse(data.anforderungen);

  const crent =
    data.crent && data.crent[0] === '{'
      ? JSON.parse(data.crent)
      : { user: false, pn: false, kasse: false };

  const hardware = hardwareAnf(anforderungen);

  const status = [
    {
      value: getValue(data.domain),
      done: isDone(data.domain),
      label: 'Citrix',
      required: true,
    },
    {
      value: getValue(data.domain) ? `${data.domain}@starcar.de` : false,
      done: isDone(data.domain),
      label: 'E-Mail',
      required: true,
    },
    {
      value: crent.user,
      done: isDone(crent.user),
      label: 'C-Rent Benutzer',
      required: true,
      stationen: anforderungen.crentstat,
    },
    {
      value: crent.pn,
      done: isDone(crent.pn),
      label: 'C-Rent PN',
      required: true,
    },
    {
      value: crent.kasse,
      done: isDone(crent.kasse),
      label: 'Kassenkonto',
      required: isRequested(anforderungen.kasse),
    },
    {
      value: getValue(data.bitrix),
      done: isDone(data.bitrix),
      label: 'Bitrix',
      required: true,
    },
    {
      value: getValue(data.docuware),
      done: isDone(data.docuware),
      label: 'Docuware',
      required: isRequested(anforderungen.docuware),
      workflow: anforderungen.workflow,
    },
    {
      value: getValue(data.qlik),
      done: isDone(data.qlik, anforderungen.qlik),
      label: 'Qlik',
      required: isRequested(anforderungen.qlik),
      stationen: anforderungen.qlikstat,
      apps: anforderungen.qlikapps,
    },
    {
      value: getValue(data.hardware),
      done: isDone(data.hardware),
      label: 'Hardware',
      required: hardware.required,
      hardware: hardware.array,
    },
    {
      value: getValue(data.vpn),
      done: isDone(data.vpn, anforderungen.vpn),
      label: 'VPN',
      required: isRequested(anforderungen.vpn),
    },
  ];

  // wenn der MA in der DB noch status 0 hatte, jetzt also erst fertig ist
  if (data.status === 0) {
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
      if (qry2.isUpdated === true) onbDoneMail({ ...data, status });
    }
  }

  return {
    id: data.id,
    anzeigen: data.anzeigen,
    anforderungen: status,
    anrede: data.anrede,
    vorname: data.vorname,
    nachname: data.nachname,
    eintritt: data.eintritt,
    ort: data.station_name,
    position: data.position,
    reg_date: data.reg_date,
  };
};

export default status;
