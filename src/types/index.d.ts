import { Types } from 'mysql';
import { Angemeldet, Benutzer } from './db';

export type TinyInt = Types.TINY;

// export interface QueryResult<T> {
//   results: T[];
//   id: number | undefined;
//   isEmpty: boolean;
//   isUpdated: boolean;
// }

export interface EmptySession {
  isLoggedIn: false;
}

export interface UserSession {
  username: string;
  admin: boolean;
  station: number;
  access: number | null;
  region: number | null;
  extstat: string | null;
  currentStation: number;
  onboarding: string | null;
  isLoggedIn: true;
}

declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

type DBResuilt = Benutzer | Angemeldet;

type JSONResponse = DBResult | UserSession | EmptySession;

declare global {
  namespace Express {
    export interface Response {
      okmsg: (response?: string | JSONResponse, code?: number) => void;
      errmsg: (message?: string, code?: number, error?: Error) => void;
      databaseConnection: () => {
        query: <Result>(sql: string, args?: unknown) => Promise<Result[]>;
        close: () => Promise<void>;
      };
    }
  }
}
