"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poswMail = exports.statwMail = exports.onbDoneMail = exports.onbNeuMail = exports.onbFreigabeMail = void 0;
const helper_1 = require("../../util/helper");
const mail_1 = require("../../util/mail");
const onbFreigabeMail = async (data) => {
    const { id, ersteller, eintritt, vorname, nachname, station_name, position } = data;
    const creator = helper_1.erstellerString(ersteller);
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator} und wartet auf die Freigabe.
  ${mail_1.divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${helper_1.toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${station_name}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;
    await mail_1.onboardingMail(helper_1.isDev ? 'ole.bergen@starcar.de' : 'personalabteilung@starcar.de', 'Freigabe neuer Mitarbeiter', mail_1.template(content));
};
exports.onbFreigabeMail = onbFreigabeMail;
const onbNeuMail = async (data) => {
    const { id, ersteller, eintritt, vorname, nachname, position, station_name } = data;
    const creator = helper_1.erstellerString(ersteller);
    const url = `https://onboarding.starcar.local/ma/${id}`;
    const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator}.
  ${mail_1.divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${helper_1.toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${station_name}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;
    await mail_1.onboardingMail(helper_1.isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de', 'Neuer Mitarbeiter', mail_1.template(content));
};
exports.onbNeuMail = onbNeuMail;
const onbDoneMail = async (data) => {
    const { id, vorname, nachname, statusArray } = data;
    const url = `https://onboarding.starcar.local/ma/${id}`;
    let rows = '';
    for (const item of statusArray) {
        if (item.required === true)
            rows += `<tr><td style="padding:0px 1.2em;">${item.label}</td><td>${item.value === true ? '✓' : item.value}</td></tr>`;
    }
    const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde fertig bearbeitet.
  ${mail_1.divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;margin-bottom:1.3em;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <table style="font-family:Helvetica, sans-serif;margin:0px;"><tbody>${rows}</tbody></table>
  <div style="margin:1.3em 0px;"><a href="${url}">Vorgang anzeigen</a></div>`;
    await mail_1.onboardingMail(helper_1.isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de', 'Mitarbeiter fertig bearbeitet', mail_1.template(content));
};
exports.onbDoneMail = onbDoneMail;
const statwMail = async (data) => {
    const { name, date, station, docuware, creator } = data;
    const ersteller = helper_1.erstellerString(creator);
    const ort = `${station === '1' ? 'Verwaltung' : `Station ${station}`}`;
    let content = `${ersteller} meldet einen Stationswechsel:<br/>${name} wechselt am ${helper_1.toLocalDate(date)} in die ${ort}`;
    if (docuware !== undefined)
        content += `<br/>Neue Docuware Workflow Gruppen: ${docuware}`;
    await mail_1.onboardingMail(helper_1.isDev ? 'ole.bergen@starcar.de' : 'onboarding@starcar.de', 'Stationswechsel', mail_1.template(content));
};
exports.statwMail = statwMail;
const poswMail = async (data) => {
    const { name, date, position, creator } = data;
    const ersteller = helper_1.erstellerString(creator);
    const content = `${ersteller} meldet einen Positionswechsel:<br/>${name} arbeitet ab ${helper_1.toLocalDate(date)} als ${position}`;
    await mail_1.onboardingMail(helper_1.isDev ? 'ole.bergen@starcar.de' : 'sc-neue-ma@starcar.de', 'Positionswechsel', mail_1.template(content));
};
exports.poswMail = poswMail;
