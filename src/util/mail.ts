import nodemailer from 'nodemailer';
import { ContentTemplate, MailTemplate } from '../../za-types/server/mail';

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

export const onboardingMail: MailTemplate = async (to, subject, html) =>
  transporter.sendMail({
    from: 'STARCAR Onboarding <onboarding@starcar.local>',
    to,
    subject,
    html,
  });

export const template: ContentTemplate = (content) => `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style>
a:link{color:#169;text-decoration:none;}
a:visited{color:#169;text-decoration:none;}
a:hover{color:#169;text-decoration:underline;}
a:active{color:#169;text-decoration:underline;}
</style></head>
<body style="font-family:Helvetica, sans-serif;font-size:14px;line-height:1.4em;color:#222">
${content}
</body></html>`;

export const divider =
  '<hr style="width:100%;height:1px;background:#ccc;border:0;margin:1.2em 0"></hr>';
