import {
  Account,
  Angemeldet,
  Aushilfen,
  Benutzer,
  Onboarding,
  Reqdelete,
  Stationen,
  Wochenende,
  Zeiten,
} from './database';
import {
  AngemeldetName,
  EmptyResult,
  MaxResult,
  OnboardingStation,
  StationOptions,
} from './results';
import { EmptySession, UserSession } from './session';

export type Session = UserSession | EmptySession;

/**
 * Alle Tabellen, entspricht ```SELECT * FROM ...```
 */
export type DBWildcard =
  | Account
  | Angemeldet
  | Aushilfen
  | Benutzer
  | Onboarding
  | Reqdelete
  | Stationen
  | Wochenende
  | Zeiten;

/**
 * Restliche SQL Ergebnisse
 */
export type DBOtherResults =
  | AngemeldetName
  | OnboardingStation
  | StationOptions
  | MaxResult;

/**
 * Alle SQL Ergebnisse aus ```results``` und ```database```
 */
export type DBResult = DBOtherResults | DBWildcard;
export type JSONResponse = Session | DBResult | DBResult[];

export interface QueryResult<T> {
  results: T[];
  isEmpty: boolean;
  // todo wirklich number?
  id?: number;
  isUpdated?: boolean;
}

export type OkayMessage = (
  response?: string | JSONResponse,
  code?: number
) => void;

export type ErrorMessage = (
  message?: string,
  code?: number,
  error?: Error
) => void;

export type ConnectionQuery = <Result = EmptyResult>(
  sql: string,
  args?: unknown
) => Promise<QueryResult<Result>>;

export type ConnectionClose = () => Promise<void>;

export type CatchError = (
  callback: () => Promise<void>,
  close?: ConnectionClose
) => Promise<void>;
