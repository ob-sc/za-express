import express from 'express';
import nodemailer from 'nodemailer';
import { okmsg } from '../util/response.js';
import auth from '../middleware/auth.js';

const mail = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"test" <test@starcar.de>', // sender address
    to: 'bergen@starcar.de, ole.bergen@starcar.de', // list of receivers
    subject: 'hi?', // Subject line
    text: 'hi', // plain text body
    html: '<span style="font-family: Arial, sans-serif;">hi</span>', // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

const router = express.Router();

router.use(auth);

router.get('', async (req, res, next) => {
  try {
    mail().catch(console.error);

    okmsg(res);
  } catch (err) {
    next(err);
  }
});

export default router;
