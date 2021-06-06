import { DateStr, TimeStr, TinyIntNull, VarCharNull } from './values';

/**
 * Werte
 */

export type FormValue = boolean | string;
export type StatusValue = FormValue;
export type DBStatusVakue = TinyIntNull | VarCharNull;

/**
 * Aus Form
 */

export interface NeuerMAForm {
  eintritt: string;
  anrede: string;
  vorname: string;
  nachname: string;
  ort: string;
  position: string;
  kasse: boolean;
  crentstat: string;
  docuware: boolean;
  workflow: string;
  qlik: boolean;
  qlikapps: string;
  qlikstat: string;
  vpn: boolean;
  freigabe: string;
  handy: boolean;
  laptop: boolean;
  pc: boolean;
  monitore: string;
  ipad: boolean;
  ipadspez: string;
  drucker: boolean;
  tanken: boolean;
  sonstiges: string;
  hardware: boolean;
}

export interface Anforderungen {
  kasse: NeuerMaForm['kasse'];
  crentstat: NeuerMaForm['crentstat'];
  docuware: NeuerMaForm['docuware'];
  workflow: NeuerMaForm['workflow'];
  qlik: NeuerMaForm['qlik'];
  qlikapps: NeuerMaForm['qlikapps'];
  qlikstat: NeuerMaForm['qlikstat'];
  vpn: NeuerMaForm['vpn'];
  freigabe: NeuerMaForm['freigabe'];
  handy: NeuerMaForm['handy'];
  laptop: NeuerMaForm['laptop'];
  pc: NeuerMaForm['pc'];
  monitore: NeuerMaForm['monitore'];
  ipad: NeuerMaForm['ipad'];
  ipadspez: NeuerMaForm['ipadspez'];
  drucker: NeuerMaForm['drucker'];
  tanken: NeuerMaForm['tanken'];
  sonstiges: NeuerMaForm['sonstiges'];
  hardware: NeuerMaForm['hardware'];
}

export interface Hardware {
  handy: NeuerMaForm['handy'];
  laptop: NeuerMaForm['laptop'];
  pc: NeuerMaForm['pc'];
  monitore: NeuerMaForm['monitore'];
  ipad: NeuerMaForm['ipad'];
  ipadspez: NeuerMaForm['ipadspez'];
  drucker: NeuerMaForm['drucker'];
  tanken: NeuerMaForm['tanken'];
  sonstiges: NeuerMaForm['sonstiges'];
  hardware: NeuerMaForm['hardware'];
}

/**
 * Status
 */

export type GetValue = (value: DBStatusVakue) => StatusValue;
export type IsRequested = (value: FormValue) => boolean;
export type IsDone = (value: FormValue) => boolean;

export interface StatusItem {
  name: string;
  value: StatusValue;
  done: boolean;
  label: string;
  required: boolean;
  suggestion?: string;
  stations?: string;
  workflow?: string;
  apps?: string;
  array?: Hardware[];
}

/**
 * Req body
 */

export interface AnmeldenBody {
  ahid: number;
  date: DateStr;
  start: TimeStr;
  station: number;
}
