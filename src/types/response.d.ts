import {
  Account,
  Angemeldet,
  AngemeldetName,
  Aushilfen,
  Benutzer,
  Onboarding,
  Reqdelete,
  Stationen,
  Wochenende,
  Zeiten,
} from './database';
import { EmptySession, UserSession } from './session';

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

export type DBJoined = AngemeldetName | OnboardingStations;

export type DBResult = DBWildcard | DBJoined;
export type JSONResponse = DBResult | DBResult[] | UserSession | EmptySession;

export interface QueryResult<T> {
  results: T[];
  isEmpty: boolean;
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

export type ConnectionQuery = <Result>(
  sql: string,
  args?: unknown
) => Promise<QueryResult<Result>>;

export type ConnectionClose = () => Promise<void>;

export type CatchError = (
  callback: () => Promise<void>,
  close?: ConnectionClose
) => Promise<void>;
