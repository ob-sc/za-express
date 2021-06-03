import { neStr } from '../../util/helper.js';

export const getValue = (value) =>
  value === true || value === 1 ? true : neStr(value) ? value : false;

export const isRequested = (value) => getValue(value) === true || neStr(value);

export const isDone = (value) => neStr(value) || value === 1;

export const hardwareAnf = (anf) => {
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

export const networkAnf = (anf) => {
  let required = false;
  const array = [];

  const pushNetwork = (label, value) => {
    array.push({ label, value });
    required = true;
  };

  if (anf.vpn === true) pushNetwork('VPN', anf.vpn);
  if (neStr(anf.verteiler)) pushNetwork('Verteiler', anf.verteiler);
  if (neStr(anf.netzdrucker)) pushNetwork('Drucker', anf.netzdrucker);
  if (neStr(anf.stddrucker)) pushNetwork('Standard Drucker', anf.stddrucker);

  return {
    required,
    array,
  };
};

export const suggestion = (vorname, nachname) => {
  const vor = vorname.trim();
  const nach = nachname.trim();

  const name = { vorname: '', nachname: '' };

  name.vorname = vor.replace(' ', '-');
  name.nachname = nach.replace(' ', '-');

  const domain = `${name.vorname}.${name.nachname}`;
  const crent = `${name.vorname[0]}${name.nachname}`;

  return { domain: domain.toLowerCase(), crent: crent.toUpperCase() };
};
