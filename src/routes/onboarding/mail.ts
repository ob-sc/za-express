import {
  MailFunction,
  OnbFreigabeMailData,
  OnbPosWMailData,
  StatWMailData,
  VorgangList,
} from '../../../za-types/server/mail';
import { StatusResult } from '../../../za-types/server/onboarding';
import { OnboardingStation } from '../../../za-types/server/results';
import { erstellerString, isDev, scEmail, toLocalDate } from '../../util/helper';
import { divider, mailTo, onboardingMail, template } from '../../util/mail';
import { hardwareAnf } from './statusHelper';

const vorgangList = (data: VorgangList, url: string, hName = false) => {
  const { eintritt, station_name, position, vorname, nachname } = data;
  const header =
    hName === true
      ? `<h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>`
      : '';

  return `${header}
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${station_name}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;
};

export const onbFreigabeMail: MailFunction<OnbFreigabeMailData> = async (data) => {
  const { id, ersteller, eintritt, vorname, nachname, station_name } = data;
  const creator = erstellerString(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;
  const vl = vorgangList(data, url, true);

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator} und kann freigegeben werden.
  ${divider}
  ${vl}`;

  await onboardingMail(
    isDev ? mailTo.dev : mailTo.perso,
    `Freigabe ${vorname[0]}. ${nachname} / ${toLocalDate(eintritt)} / ${station_name}`,
    template(content)
  );
};

export const onbNeuMail: MailFunction<OnboardingStation> = async (data) => {
  const { id, ersteller, eintritt, vorname, nachname, station_name } = data;
  const creator = erstellerString(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;
  const vl = vorgangList(data, url, true);

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator}.
  ${divider}
  ${vl}`;

  await onboardingMail(
    isDev ? mailTo.dev : mailTo.onboarding,
    `Eintritt ${vorname[0]}. ${nachname} / ${toLocalDate(eintritt)} /  ${station_name}`,
    template(content)
  );
};

export const onbHardwareMail: MailFunction<OnboardingStation> = async (data) => {
  const { id, ersteller, eintritt, vorname, nachname, station_name } = data;
  const creator = erstellerString(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;
  const vl = vorgangList(data, url, true);

  const anforderungen = JSON.parse(data.anforderungen);
  const { array } = hardwareAnf(anforderungen);

  let tableBody = '';

  for (const item of array) {
    tableBody += `<tr><td style="font-family:Helvetica, sans-serif;font-size:14px;line-height:1.4em;">${
      item.label
    }</td><td>${
      // kann nur true sein, weil hardwareAnf nur true gibt
      typeof item.value === 'boolean' ? '✓' : item.value
    }</td></tr>`;
  }

  const content = `Es wurde Hardware für <a href="${url}">${vorname} ${nachname}</a> von ${creator} angefordert.
  <table>
    <tbody>
      ${tableBody}
    </tbody>
  </table>

  ${divider}
  ${vl}`;

  await onboardingMail(
    isDev ? mailTo.dev : mailTo.hardware,
    `Hardware für ${vorname[0]}. ${nachname} / ${toLocalDate(eintritt)} /  ${station_name}`,
    template(content)
  );
};

export const onbDoneMail: MailFunction<StatusResult> = async (data) => {
  const { id, vorname, nachname } = data;
  const url = `https://onboarding.starcar.local/ma/${id}`;
  const vl = vorgangList(data, url, true);

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde fertig bearbeitet.
  ${divider}
  ${vl}`;

  await onboardingMail(
    isDev ? mailTo.dev : mailTo.onboarding,
    `Zugänge ${vorname[0]}. ${nachname} fertig`,
    template(content)
  );
};

export const onbErstellerMail: MailFunction<StatusResult> = async (data) => {
  const { id, ersteller, vorname, nachname } = data;
  const creator = erstellerString(ersteller);
  const creatorNames = creator.split(' ');
  const creatorMail = scEmail(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;
  const vl = vorgangList(data, url);

  const content = `<p>Hallo ${creatorNames[0]},</p>
  <p><a href="${url}">${vorname} ${nachname}</a> hat jetzt alle Zugänge.</p>
  ${vl}

  <p>Viele Grüße,<br/>
  deine Personalabteilung</p>`;

  await onboardingMail(
    isDev ? mailTo.dev : creatorMail,
    `${vorname} ${nachname} fertig bearbeitet`,
    template(content)
  );
};

export const statwMail: MailFunction<StatWMailData> = async (data) => {
  const { name, date, station, docuware, creator } = data;
  const ersteller = erstellerString(creator);
  const datum = toLocalDate(date);

  const ort = station === '1' ? 'Verwaltung' : `Station ${station}`;
  const dw = docuware !== undefined ? `<br/>Neue Docuware Workflow Gruppen: ${docuware}` : '';

  const content = `${ersteller} meldet einen Stationswechsel:<br/>${name} wechselt am ${datum} in die ${ort}.${dw}`;

  await onboardingMail(
    isDev ? mailTo.dev : mailTo.onboarding,
    `Stationswechsel ${name} / ${datum} / ${ort}`,
    template(content)
  );
};

export const poswMail: MailFunction<OnbPosWMailData> = async (data) => {
  const { name, date, position, creator } = data;
  const ersteller = erstellerString(creator);
  const datum = toLocalDate(date);

  const content = `${ersteller} meldet einen Positionswechsel:<br/>${name} arbeitet ab ${datum} als ${position}`;

  await onboardingMail(
    isDev ? mailTo.dev : mailTo.onboarding,
    `Positionswechsel ${name} / ${datum} / ${position}`,
    template(content)
  );
};
