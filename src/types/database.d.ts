import {
  DateStr,
  DateStrNull,
  FloatNull,
  Int,
  IntNull,
  TimeStr,
  Timestamp,
  TinyInt,
  TinyIntNull,
  VarChar,
  VarCharNull,
} from './types';

export interface Account {
  id: Int;
  token: VarChar;
  reg_date: Timestamp;
}

export interface Angemeldet {
  id: Int;
  ahid: Int;
  station: Int;
  date: VarChar;
  start: VarChar;
}

export interface Aushilfen {
  id: Int;
  personalnr: IntNull;
  vorname: VarChar;
  nachname: VarChar;
  norlohn: FloatNull;
  samlohn: FloatNull;
  sonlohn: FloatNull;
  station: Int;
  status: VarChar;
  fs_kontrolle: DateStrNull;
  reg_date: Timestamp;
}

export interface Benutzer {
  id: Int;
  username: VarChar;
  password: VarChar;
  active: TinyInt;
  admin: TinyInt;
  station: Int;
  access: IntNull;
  region: IntNull;
  onboarding: VarCharNull;
  extstat: VarCharNull;
  allow_onboarding: TinyInt;
}

export interface Onboarding {
  id: Int;
  anrede: VarChar;
  status: TinyInt;
  ersteller: VarChar;
  vorname: VarChar;
  nachname: VarChar;
  eintritt: DateStr;
  station: Int;
  position: VarChar;
  anforderungen: VarChar;
  domain: VarChar;
  bitrix: TinyIntNull;
  docuware: TinyIntNull;
  crent: VarCharNull;
  qlik: TinyIntNull;
  hardware: TinyIntNull;
  network: TinyIntNull;
  anzeigen: TinyInt;
  reg_date: Timestamp;
}

export interface Reqdelete {
  id: Int;
  zeitid: Int;
  user: Int;
  station: Int;
  reg_date: Timestamp;
}

export interface Stationen {
  id: Int;
  name: VarChar;
  anschrift: VarChar;
  stadt: VarChar;
  telefon: VarChar;
  fax: VarChar;
  email: VarChar;
  region: VarChar;
}

export interface Wochenende {
  id: Int;
  datum: DateStr;
  name: VarChar;
  stunden: Int;
  ausgleich: VarChar;
  station: Int;
}

export interface Zeiten {
  id: Int;
  ahid: Int;
  datum: DateStr;
  beginn: TimeStr;
  ende: TimeStr;
  arbeitszeit: Int;
  gehalt: Int;
  disponent: Int;
  station: Int;
  ahstation: Int;
  ahmax: VarChar;
  reg_date: Timestamp;
}
