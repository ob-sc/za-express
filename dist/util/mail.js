"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divider = exports.template = exports.onboardingMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: '192.168.100.50',
    port: 25,
    secure: false,
});
const onboardingMail = async (to, subject, html) => transporter.sendMail({
    from: 'STARCAR Onboarding <onboarding@starcar.local>',
    to,
    subject,
    html,
});
exports.onboardingMail = onboardingMail;
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
exports.template = template;
exports.divider = '<hr style="width:100%;height:1px;background:#ccc;border:0;margin:1.2em 0"></hr>';
