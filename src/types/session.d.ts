import { Int, IntNull, VarChar, VarCharOpt } from './values';

export interface EmptySession {
  isLoggedIn: false;
}

export interface UserSession {
  username: VarChar;
  admin: boolean;
  station: Int;
  access: IntNull;
  region: IntNull;
  extstat: VarCharOpt;
  currentStation: Int;
  onboarding: VarCharOpt;
  isLoggedIn: true;
}
