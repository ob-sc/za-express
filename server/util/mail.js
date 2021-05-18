import nodemailer from 'nodemailer';

const mail = async (from = 'aushilfen', to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: '192.168.100.50',
    port: 25,
    secure: false,
  });

  await transporter.sendMail({
    from:
      from === 'aushilfen'
        ? 'STARCAR Aushilfen <aushilfen@starcar.local>'
        : from === 'onboarding'
        ? 'STARCAR Onboarding <onboarding@starcar.local>'
        : 'STARCAR <noreply@starcar.de>',
    to,
    subject,
    text,
    html,
  });
};

// in mail direkt link zu id

export default mail;

// await transporter.sendMail({
//   from: 'STARCAR Onboarding <onboarding@starcar.de>',
//   to: 'ole.bergen@starcar.de',
//   subject: 'hi?',
//   text: 'hi',
//   html: '<span style="font-family: Arial, sans-serif;">hi</span>',
// });
