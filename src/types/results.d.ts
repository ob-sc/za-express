import { Angemeldet, Onboarding, Stationen } from './database';

/**
 * SELECTs mit JOIN
 */

export interface AngemeldetName extends Angemeldet {
  vorname: Aushilfen['vorname'];
  nachname: Aushilfen['nachname'];
}

export interface OnboardingStation extends Onboarding {
  station_name: Stationen['name'];
}

/**
 * SELECT einzelnes
 */

export interface StationName {
  name: Stationen['name'];
}
