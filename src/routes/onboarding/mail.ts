import {
  MailFunction,
  OnbFreigabeMailData,
  OnbPosWMailData,
  StatWMailData,
} from '../../../types/mail';
import { StatusResult } from '../../../types/onboarding';
import { OnboardingStation } from '../../../types/results';
import { erstellerString, isDev, toLocalDate } from '../../util/helper';
import { template, divider, onboardingMail } from '../../util/mail';

// todo test ob await mail und dann ok klappt
// todo am besten falsche ip bei mail und dann gucken ob okmsg gesendet wird

export const onbFreigabeMail: MailFunction<OnbFreigabeMailData> = async (
  data
) => {
  const {
    id,
    ersteller,
    eintritt,
    vorname,
    nachname,
    station_name,
    position,
  } = data;
  const creator = erstellerString(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator} und wartet auf die Freigabe.
  ${divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${station_name}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'personalabteilung@starcar.de',
    'Freigabe neuer Mitarbeiter',
    template(content)
  );
};

export const onbNeuMail: MailFunction<OnboardingStation> = async (data) => {
  const {
    id,
    ersteller,
    eintritt,
    vorname,
    nachname,
    position,
    station_name,
  } = data;
  const creator = erstellerString(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator}.
  ${divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${station_name}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de',
    'Neuer Mitarbeiter',
    template(content)
  );
};

export const onbDoneMail: MailFunction<StatusResult> = async (data) => {
  const { id, vorname, nachname, statusArray } = data;
  const url = `https://onboarding.starcar.local/ma/${id}`;

  let rows = '';
  for (const item of statusArray) {
    if (item.required === true)
      rows += `<tr><td style="padding:0px 1.2em;">${item.label}</td><td>${
        item.value === true ? '✓' : item.value
      }</td></tr>`;
  }

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde fertig bearbeitet.
  ${divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;margin-bottom:1.3em;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <table style="font-family:Helvetica, sans-serif;margin:0px;"><tbody>${rows}</tbody></table>
  <div style="margin:1.3em 0px;"><a href="${url}">Vorgang anzeigen</a></div>`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de',
    'Mitarbeiter fertig bearbeitet',
    template(content)
  );
};

export const statwMail: MailFunction<StatWMailData> = async (data) => {
  const { name, date, station, docuware, creator } = data;
  const ersteller = erstellerString(creator);

  const ort = `${station === '1' ? 'Verwaltung' : `Station ${station}`}`;

  let content = `${ersteller} meldet einen Stationswechsel:<br/>${name} wechselt am ${toLocalDate(
    date
  )} in die ${ort}`;
  if (docuware !== undefined)
    content += `<br/>Neue Docuware Workflow Gruppen: ${docuware}`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de',
    'Stationswechsel',
    template(content)
  );
};

export const poswMail: MailFunction<OnbPosWMailData> = async (data) => {
  const { name, date, position, creator } = data;
  const ersteller = erstellerString(creator);

  const content = `${ersteller} meldet einen Positionswechsel:<br/>${name} arbeitet ab ${toLocalDate(
    date
  )} als ${position}`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de',
    'Positionswechsel',
    template(content)
  );
};
