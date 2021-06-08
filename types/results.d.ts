import { Angemeldet, Onboarding, Stationen, Zeiten } from './database';
import { QueryResult } from './response';

/**
 * Leer bei insert, update, delete
 */
export type EmptyResult = QueryResult<never>;

// SELECTs mit JOIN

export interface AngemeldetName extends Angemeldet {
  vorname: Aushilfen['vorname'];
  nachname: Aushilfen['nachname'];
}

export interface OnboardingStation extends Onboarding {
  station_name: Stationen['name'];
}

// SELECT einzelnes

export interface StationName {
  name: Stationen['name'];
}

export interface StationOptions {
  optval: Stationen['id'];
  optlabel: Stationen['name'];
}

export interface ZeitenMax {
  max: Zeiten['gehalt'];
}

export interface MaxResult {
  // todo stimmen types?
  id: string;
  status: string;
  sum: number;
}
