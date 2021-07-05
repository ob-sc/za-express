import { NumOrWildcard } from '../../za-types/server/types';
import {
  CheckArray,
  CheckObject,
  NotEmptyString,
  OnboardingAuthResult,
  ParseStringArray,
  Prepend0,
  Spaces,
  StringFn,
} from '../../za-types/server/util';

export const isDev = process.env.NODE_ENV === 'development';

export const capitalize: StringFn = (str) => str[0].toUpperCase() + str.substring(1);

export const erstellerString: StringFn = (str) => {
  if (str.indexOf('.') === -1) return str;

  const creatorArray = str.split('.');
  let [vorname, nachname] = creatorArray;

  if (vorname.indexOf('-') !== -1) {
    const vorArray = vorname.split('-');
    vorname = `${capitalize(vorArray[0])} ${capitalize(vorArray[1])}`;
  } else vorname = capitalize(vorname);

  if (nachname.indexOf('-') !== -1) {
    const nachArray = nachname.split('-');
    nachname = `${capitalize(nachArray[0])} ${capitalize(nachArray[1])}`;
  } else nachname = capitalize(nachname);

  return `${vorname} ${nachname}`;
};

export const prepend0: Prepend0 = (num) => num.toString().padStart(2, '0');

export const toLocalDate: StringFn = (str) => {
  const date = new Date(str);
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  // monat ist zero-indexed
  return `${prepend0(d)}.${prepend0(m + 1)}.${y}`;
};

export const notEmptyString: NotEmptyString = (value) => typeof value === 'string' && value !== '';

export const checkObject: CheckObject = (obj) => typeof obj === 'object' && obj !== null;

export const checkArray: CheckArray = (arr) => Array.isArray(arr);

export const spaces: Spaces = (params) => {
  let statement = '';

  const len = params.length;
  let i = 0;
  while (i < len) {
    statement += `${params[i]} `;
    i++;
  }

  return statement.trim();
};

export const scEmail: StringFn = (user) => `${user}@starcar.de`;

export const parseStringArray: ParseStringArray = (string) => {
  if (!string) return [];

  const array = string.split(',');
  const result: NumOrWildcard[] = [];

  for (let index = 0; index < array.length; index++) {
    const str = array[index];
    result.push(str !== '*' ? Number(str) : str);
  }

  return result;
};

export const onboardingAuthResult: OnboardingAuthResult = (user, results, authFn) => {
  const authed = [];

  for (const r of results) {
    const isAdmin = user?.admin === true;
    const isReleased = r.anzeigen === true;
    const isOwn = user?.username === r.ersteller;
    const hasStation = authFn(r.station);

    if (isAdmin || (isReleased && (isOwn || hasStation))) authed.push(r);
  }

  return authed;
};
