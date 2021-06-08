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
      /**
       * Sendet Antwort, default status code ist 200.
       * Antwort ist JSON in dieser Form:
       * ```{ message: string, code: number, result: {} | [] }```
       */
      okmsg: OkayMessage;
      /**
       * Sendet Fehler-Antwort, default status code ist 500.
       * Antwort ist JSON in dieser Form:
       * ```{ message: string, code: number, error: Error }```
       */
      errmsg: ErrorMessage;
      /**
       * Erstellt eine neue Verbindung zur DB.
       * Muss mit ```await close()``` geschlossen werden, vor jedem ```return```.
       * @example
       * const { query, close } = res.database()
       */
      database: () => {
        query: ConnectionQuery;
        close: ConnectionClose;
      };
      /**
       *  ```try {  } catch (err) {  }``` Block.
       * Schließt die Verbindung bei einem Fehler nur,
       * wenn diese als zweites Argument existiert.
       * Die Verbindung muss nach den queries /
       * vor einem ```return``` geschlossen werden
       *
       * @example
       * await catchError(async () => {
       *   await doSomething();
       *   await close();
       * }, close)
       */
      catchError: CatchError;
    }
  }
}
