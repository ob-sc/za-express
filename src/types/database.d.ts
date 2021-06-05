import { TinyInt } from './index';

interface Angemeldet {
  id: number;
  ahid: number;
  station: number;
  date: string;
  start: string;
}

interface Benutzer {
  id: number;
  username: string;
  password: string;
  active: TinyInt;
  admin: TinyInt;
  station: number;
  access: number | null;
  region: number | null;
  onboarding: string | null;
  extstat: string | null;
  allow_onboarding: TinyInt;
}

export { Angemeldet, Benutzer };
