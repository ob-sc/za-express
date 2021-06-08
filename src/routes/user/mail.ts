import {
  AccountInfoMail,
  ConfirmMailData,
  MailFunction,
} from '../../../types/mail';
import { isDev } from '../../util/helper';
import { template, onboardingMail } from '../../util/mail';

export const confirmMail: MailFunction<ConfirmMailData> = async (data) => {
  const { token, to } = data;

  const url = `https://onboarding.starcar.local/confirm/${token}`;

  const content = `Dein Account wurde erfolgreich angelegt.<br/>
  <a href="${url}">Account bestätigen</a>`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : to,
    'Account bestätigen',
    template(content)
  );
};

export const infoMail: MailFunction<AccountInfoMail> = async ({ user }) => {
  const content = `Benutzer ${user} hat sich einen Account erstellt`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'onboarding@starcar.de',
    'Neuer Benutzer',
    template(content)
  );
};
