import nodemailer from 'nodemailer';
import { erstellerString } from './string';

const transporter = nodemailer.createTransport({
  host: '192.168.100.50',
  port: 25,
  secure: false,
});

// const aushilfen = async (to, subject, text, html) => {
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

export const onbNeuMail = async (query, data) => {
  const creator = erstellerString(data.ersteller);
  const url = `https://onboarding.starcar.local/ma/${query.id}`;

  const content = `
  Mitarbeiter <a href="${url}">#${query.id}</a> wurde angelegt von ${creator}.

  ${divider}

  <h1 style="font-family:sans-serif;margin:0px;font-size:1.3em;line-height:1.4em"></h1>
  <a href="${url}">Vorgang anzeigen</a>
  `;

  await onboardingMail(
    ['bergen@starcar.de'],
    'Neuer Mitarbeiter',
    template(content)
  );
};

const template = (content) => `
  <!DOCTYPE html>
  <html>
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <style>
  a:link{color:#169}
  a:visited{color:#169}
  a:hover{color:#169}
  a:active{color:#169}
  </style>
  </head>
  <body style="font-family:sans-serif;font-size:14px;line-height:1.4em;color:#222">
  ${content}
  </body>
  </html>
`;

const divider =
  '<hr style="width:100%;height:1px;background:#ccc;border:0;margin:1.2em 0"></hr>';
