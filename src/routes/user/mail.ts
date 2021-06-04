import { isDev } from '../../util/helper';
import { template, onboardingMail } from '../../util/mail';

export const confirmMail = async (token, to) => {
  const url = `https://onboarding.starcar.local/confirm/${token}`;

  const content = `Dein Account wurde erfolgreich angelegt.<br/>
  <a href="${url}">Account bestätigen</a>`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : to,
    'Account bestätigen',
    template(content)
  );
};

export const infoMail = async (user) => {
  const content = `Benutzer ${user} hat sich einen Account erstellt`;

  await onboardingMail(
    isDev ? 'ole.bergen@starcar.de' : 'onboarding@starcar.de',
    'Neuer Benutzer',
    template(content)
  );
};
