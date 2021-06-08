import {
  CheckArray,
  CheckObject,
  NotEmptyString,
  Prepend0,
  Spaces,
  StringFn,
} from '../../types/util';

export const isDev = process.env.NODE_ENV === 'development';

export const capitalize: StringFn = (str) =>
  str[0].toUpperCase() + str.substring(1);

export const erstellerString: StringFn = (str) => {
  if (str.indexOf('.') === -1) return str;

  const creatorArray = str.split('.');
  let vorname = creatorArray[0];

  if (vorname.indexOf('-') !== -1) {
    const vorArray = vorname.split('-');
    vorname = `${capitalize(vorArray[0])} ${capitalize(vorArray[1])}`;
  } else vorname = capitalize(vorname);

  let nachname = creatorArray[1];
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

export const notEmptyString: NotEmptyString = (value) =>
  typeof value === 'string' && value !== '';

export const checkObject: CheckObject = (obj) =>
  typeof obj === 'object' && obj !== null;

export const checkArray: CheckArray = (arr) => Array.isArray(arr);

export const spaces: Spaces = (params) => {
  let statement = '';

  const len = params.length;
  let i = 0;
  while (i < len) {
    statement += params[i] + ' ';
    i++;
  }

  return statement.trim();
};
