import { ConnectionQuery } from './response';
import { OnboardingStation } from './results';
import { FormValue, TinyIntNull, VarCharNull } from './types';

export type StatusValue = string | boolean;
export type DBStatusValue = TinyIntNull | VarCharNull;
export type CrentStatusValue = string | false;
export type LabelValue = { label: string; value: StatusValue };

export type GetValue = (value: DBStatusValue | FormValue) => StatusValue;
export type IsRequested = (value: FormValue) => boolean;

export type AnfReturn = { required: boolean; array: LabelValue[] };
export type PushAnf = (label: string, value: StatusValue) => void;
export type AnfFunction = (anf: Anforderungen) => AnfReturn;

export type Suggestion = (
  vorname: string,
  nachname: string
) => { domain: string; crent: string };

export type StatusFunction = (
  query: ConnectionQuery,
  id: string
) => Promise<StatusResult | null>;

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

export interface StatusResult extends OnboardingStation {
  statusArray: statusItem[];
}

/**
 * Aus form /neu
 */
export type NeuerMAForm = MaDetails & Anforderungen;

/**
 * Erster Teil von NeuerMaForm
 */
export interface MaDetails {
  eintritt: string;
  anrede: string;
  vorname: string;
  nachname: string;
  ort: string;
  position: string;
}

/**
 * Zweiter Teil von NeuerMaForm
 */
export interface Anforderungen {
  kasse: boolean;
  crentstat: string;
  docuware: boolean;
  workflow: string;
  qlik: boolean;
  qlikapps: string;
  qlikstat: string;
  vpn: boolean;
  verteiler: string;
  netzdrucker: string;
  stddrucker: string;
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
