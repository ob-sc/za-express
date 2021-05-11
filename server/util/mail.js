import nodemailer from 'nodemailer';

const mail = async () => {
  let transporter = nodemailer.createTransport({
    host: '192.168.100.50',
    port: 25,
    secure: false,
  });

  await transporter.sendMail({
    from: 'STARCAR Onboarding <onboarding@starcar.de>',
    to: 'ole.bergen@starcar.de',
    subject: 'hi?',
    text: 'hi',
    html: '<span style="font-family: Arial, sans-serif;">hi</span>',
  });
};

// in mail direkt link zu id

export default mail;
