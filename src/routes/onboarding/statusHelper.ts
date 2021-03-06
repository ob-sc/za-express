import {
  AnfFunction,
  GetValue,
  IsRequested,
  LabelValue,
  PushAnf,
  Suggestion,
} from '../../../za-types/server/onboarding';
import { notEmptyString } from '../../util/helper';

export const getValue: GetValue = (value) => {
  if (typeof value === 'string') return value !== '' ? value : false;
  return value === true;
};

export const isRequested: IsRequested = (value) =>
  getValue(value) === true || notEmptyString(value);

export const hardwareAnf: AnfFunction = (anf) => {
  let required = false;
  const array: LabelValue[] = [];

  const pushHardware: PushAnf = (label, value) => {
    array.push({ label, value });
    required = true;
  };

  if (anf.handy === true) pushHardware('Handy', anf.handy);
  if (anf.laptop === true) pushHardware('Laptop', anf.laptop);
  if (anf.pc === true) pushHardware('Computer', anf.pc);
  if (notEmptyString(anf.monitore)) pushHardware('Monitore', anf.monitore);
  if (anf.ipad === true) pushHardware('iPad', anf.ipad);
  if (notEmptyString(anf.ipadspez)) pushHardware('iPad spez.', anf.ipadspez);
  if (anf.drucker === true) pushHardware('Drucker', anf.drucker);
  if (anf.tanken === true) pushHardware('Tankkarte', anf.tanken);
  if (notEmptyString(anf.freigabe)) pushHardware('Freigabe', anf.freigabe);
  if (notEmptyString(anf.sonstiges)) pushHardware('Sonstiges', anf.sonstiges);

  return {
    required,
    array,
  };
};

export const networkAnf: AnfFunction = (anf) => {
  let required = false;
  const array: LabelValue[] = [];

  const pushNetwork: PushAnf = (label, value) => {
    array.push({ label, value });
    required = true;
  };

  if (anf.vpn === true) pushNetwork('VPN', anf.vpn);
  if (notEmptyString(anf.verteiler)) pushNetwork('Verteiler', anf.verteiler);
  if (notEmptyString(anf.netzdrucker)) pushNetwork('Drucker', anf.netzdrucker);
  if (notEmptyString(anf.stddrucker)) pushNetwork('Standard Drucker', anf.stddrucker);

  return {
    required,
    array,
  };
};

export const suggestion: Suggestion = (vorname, nachname) => {
  const vor = vorname.trim();
  const nach = nachname.trim();

  const name = { vorname: '', nachname: '' };

  name.vorname = vor.replace(' ', '-');
  name.nachname = nach.replace(' ', '-');

  const domain = `${name.vorname}.${name.nachname}`;
  const crent = `${name.vorname[0]}${name.nachname}`;

  return { domain: domain.toLowerCase(), crent: crent.toUpperCase() };
};
