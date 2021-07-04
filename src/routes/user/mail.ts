import { ConfirmMailData, MailFunction } from '../../../za-types/server/mail';
import { isDev } from '../../util/helper';
import { onboardingMail, template } from '../../util/mail';

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
