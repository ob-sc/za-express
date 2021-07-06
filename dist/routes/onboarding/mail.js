"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poswMail = exports.statwMail = exports.onbErstellerMail = exports.onbDoneMail = exports.onbHardwareMail = exports.onbNeuMail = exports.onbFreigabeMail = void 0;
const helper_1 = require("../../util/helper");
const mail_1 = require("../../util/mail");
const statusHelper_1 = require("./statusHelper");
const vorgangList = (data, url, hName = false) => {
    const { eintritt, station_name, position, vorname, nachname } = data;
    const header = hName === true
        ? `<h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>`
        : '';
    return `${header}
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${helper_1.toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${station_name}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;
};
const onbFreigabeMail = async (data) => {
    const { id, ersteller, eintritt, vorname, nachname, station_name } = data;
    const creator = helper_1.erstellerString(ersteller);
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const vl = vorgangList(data, url, true);
    const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator} und kann freigegeben werden.
  ${mail_1.divider}
  ${vl}`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : mail_1.mailTo.perso, `Freigabe ${vorname[0]}. ${nachname} / ${helper_1.toLocalDate(eintritt)} / ${station_name}`, mail_1.template(content));
};
exports.onbFreigabeMail = onbFreigabeMail;
const onbNeuMail = async (data) => {
    const { id, ersteller, eintritt, vorname, nachname, station_name } = data;
    const creator = helper_1.erstellerString(ersteller);
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const vl = vorgangList(data, url, true);
    const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator}.
  ${mail_1.divider}
  ${vl}`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : mail_1.mailTo.onboarding, `Eintritt ${vorname[0]}. ${nachname} / ${helper_1.toLocalDate(eintritt)} /  ${station_name}`, mail_1.template(content));
};
exports.onbNeuMail = onbNeuMail;
const onbHardwareMail = async (data) => {
    const { id, ersteller, eintritt, vorname, nachname, station_name } = data;
    const creator = helper_1.erstellerString(ersteller);
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const vl = vorgangList(data, url, true);
    const anforderungen = JSON.parse(data.anforderungen);
    const { array } = statusHelper_1.hardwareAnf(anforderungen);
    let tableBody = '';
    for (const item of array) {
        tableBody += `<tr><td style="font-family:Helvetica, sans-serif;font-size:14px;line-height:1.4em;">${item.label}</td><td>${typeof item.value === 'boolean' ? '✓' : item.value}</td></tr>`;
    }
    const content = `Es wurde Hardware für <a href="${url}">${vorname} ${nachname}</a> von ${creator} angefordert.
  <table>
    <tbody>
      ${tableBody}
    </tbody>
  </table>

  ${mail_1.divider}
  ${vl}`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : mail_1.mailTo.hardware, `Hardware für ${vorname[0]}. ${nachname} / ${helper_1.toLocalDate(eintritt)} /  ${station_name}`, mail_1.template(content));
};
exports.onbHardwareMail = onbHardwareMail;
const onbDoneMail = async (data) => {
    const { id, vorname, nachname } = data;
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const vl = vorgangList(data, url, true);
    const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde fertig bearbeitet.
  ${mail_1.divider}
  ${vl}`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : mail_1.mailTo.onboarding, `Zugänge ${vorname[0]}. ${nachname} fertig`, mail_1.template(content));
};
exports.onbDoneMail = onbDoneMail;
const onbErstellerMail = async (data) => {
    const { id, ersteller, vorname, nachname } = data;
    const creator = helper_1.erstellerString(ersteller);
    const creatorNames = creator.split(' ');
    const creatorMail = helper_1.scEmail(ersteller);
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const vl = vorgangList(data, url);
    const content = `<p>Hallo ${creatorNames[0]},</p>
  <p><a href="${url}">${vorname} ${nachname}</a> hat jetzt alle Zugänge.</p>
  ${vl}

  <p>Viele Grüße,<br/>
  deine Personalabteilung</p>`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : creatorMail, `${vorname} ${nachname} fertig bearbeitet`, mail_1.template(content));
};
exports.onbErstellerMail = onbErstellerMail;
const statwMail = async (data) => {
    const { name, date, station, docuware, creator } = data;
    const ersteller = helper_1.erstellerString(creator);
    const datum = helper_1.toLocalDate(date);
    const ort = station === '1' ? 'Verwaltung' : `Station ${station}`;
    const dw = docuware !== undefined ? `<br/>Neue Docuware Workflow Gruppen: ${docuware}` : '';
    const content = `${ersteller} meldet einen Stationswechsel:<br/>${name} wechselt am ${datum} in die ${ort}.${dw}`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : mail_1.mailTo.onboarding, `Stationswechsel ${name} / ${datum} / ${ort}`, mail_1.template(content));
};
exports.statwMail = statwMail;
const poswMail = async (data) => {
    const { name, date, position, creator } = data;
    const ersteller = helper_1.erstellerString(creator);
    const datum = helper_1.toLocalDate(date);
    const content = `${ersteller} meldet einen Positionswechsel:<br/>${name} arbeitet ab ${datum} als ${position}`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : mail_1.mailTo.onboarding, `Positionswechsel ${name} / ${datum} / ${position}`, mail_1.template(content));
};
exports.poswMail = poswMail;
