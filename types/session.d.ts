import { Int, IntNull, VarChar, VarCharOpt } from './types';

export interface EmptySession {
  isLoggedIn: false;
}

// todo stimmen die werte oder sind die int manchmal string? debug und am besten auch console.log ob number rauskommt

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
