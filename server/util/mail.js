import nodemailer from 'nodemailer';
import { erstellerString, toLocalDate } from './helper';

const transporter = nodemailer.createTransport({
  host: '192.168.100.50',
  port: 25,
  secure: false,
});

// const aushilfenMail = async (to, subject, text, html) => {
//   await transporter.sendMail({
//     from: 'STARCAR Aushilfen <aushilfen@starcar.local>',
//     to,
//     subject,
//     html,
//   });
// };

const onboardingMail = async (to, subject, html) =>
  await transporter.sendMail({
    from: 'STARCAR Onboarding <onboarding@starcar.local>',
    to,
    subject,
    html,
  });

export const onbNeuMail = async (data) => {
  const { id, ersteller, eintritt, vorname, nachname, position } = data;
  const creator = erstellerString(ersteller);
  const url = `https://onboarding.starcar.local/ma/${id}`;

  const content = `Mitarbeiter <a href="${url}">#${id}</a> wurde angelegt von ${creator}.
  ${divider}
  <h1 style="font-family:Helvetica, Verdana, sans-serif;margin:0px;font-size:1.3em;line-height:1.4em">${vorname} ${nachname}</h1>
  <ul style="margin-bottom:1.5em">
  <li>Eintritt: ${toLocalDate(eintritt)}</li>
  <li>Arbeitsort: ${data.ort}</li>
  <li>Position: ${position}</li></ul>
  <a href="${url}">Vorgang anzeigen</a>`;

  await onboardingMail(
    ['bergen@starcar.de'],
    'Neuer Mitarbeiter',
    template(content)
  );
};

export const onbDoneMail = async (data) => {
  const { id, vorname, nachname } = data;
  const url = `https://onboarding.starcar.local/ma/${id}`;

  let rows = '';
  for (const item of data.status) {
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
    ['bergen@starcar.de'],
    'Mitarbeiter fertig bearbeitet',
    template(content)
  );
};

const template = (content) => `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style>
a:link{color:#169;text-decoration:none;}
a:visited{color:#169;text-decoration:none;}
a:hover{color:#169;text-decoration:underline;}
a:active{color:#169;text-decoration:underline;}
</style></head>
<body style="font-family:Helvetica, sans-serif;font-size:14px;line-height:1.4em;color:#222">
${content}
</body></html>`;

const divider =
  '<hr style="width:100%;height:1px;background:#ccc;border:0;margin:1.2em 0"></hr>';
