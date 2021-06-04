export const isDev = process.env.NODE_ENV === 'development';

const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

export const erstellerString = (str) => {
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

const prepend0 = (num) => (num < 10 ? `0${num}` : num);

export const toLocalDate = (str) => {
  const date = new Date(str);
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  // monat ist zero-indexed
  return `${prepend0(d)}.${prepend0(m + 1)}.${y}`;
};

// nicht empty string
export const neStr = (value) => typeof value === 'string' && value !== '';
