import { UserSession } from './session';
import {
  CatchError,
  ConnectionClose,
  ConnectionQuery,
  ErrorMessage,
  OkayMessage,
} from './response';

declare module 'express-session' {
  interface SessionData {
    user: UserSession;
  }
}

declare global {
  namespace Express {
    export interface Response {
      okmsg: OkayMessage;
      errmsg: ErrorMessage;
      database: () => {
        query: ConnectionQuery;
        close: ConnectionClose;
      };
      catchError: CatchError;
    }
  }
}
