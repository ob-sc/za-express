const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

export const erstellerString = (str) => {
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

export const prepend0 = (str) => (Number(str) < 10 ? `0${str}` : str);

export const toLocalDate = (str) => {
  const date = new Date(str);
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  // monat ist zero-indexed
  return `${prepend0(d)}.${prepend0(m + 1)}.${y}`;
};
