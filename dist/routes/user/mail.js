"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMail = void 0;
const helper_1 = require("../../util/helper");
const mail_1 = require("../../util/mail");
const confirmMail = async (data) => {
    const { token, to } = data;
    const url = `https://onboarding.starcar.local/confirm/${token}`;
    const content = `Dein Account wurde erfolgreich angelegt.<br/>
  <a href="${url}">Account bestätigen</a>`;
    await mail_1.onboardingMail(helper_1.isDev ? mail_1.mailTo.dev : to, 'Account bestätigen', mail_1.template(content));
};
exports.confirmMail = confirmMail;
