import express from 'express';
import nodemailer from 'nodemailer';
import { okmsg } from '../util/response.js';
import auth from '../middleware/auth.js';

const mail = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: '192.168.100.50',
    port: 25,
    secure: false, // true for 465, false for other ports
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'STARCAR Onboarding <onboarding@starcar.de>', //
    to: 'ole.bergen@starcar.de',
    subject: 'hi?',
    text: 'hi',
    html: '<span style="font-family: Arial, sans-serif;">hi</span>',
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const router = express.Router();

router.use(auth);

router.get('', async (req, res, next) => {
  try {
    await mail();
    okmsg(res);
  } catch (err) {
    next(err);
  }
});

export default router;
