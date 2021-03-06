import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import expressMySqlSession from 'express-mysql-session';
import cors from 'cors';
import { isDev } from './util/helper';
import { db, sess } from './config';
import { catchError, database, errorHandler, notFound, response } from './middleware/';
import { angemeldet, aushilfen, auth, onboarding, stationen, user, zeiten } from './routes';
import authStation from './middleware/authStation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MySQLStore = expressMySqlSession(session as any);
const sessionStore = new MySQLStore({ ...db, expiration: sess.cookie.maxAge });

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: isDev ? 'http://localhost:3000' : /starcar\.local$/, credentials: true }));
app.use(cookieParser());
app.use(
  session({
    ...sess,
    store: sessionStore,
  })
);
app.use(logger(isDev ? 'dev' : 'short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// res.okmsg & res.errmsg
app.use(response);

// res.connection & res.query
app.use(database);

// try / catch block der die bei Fehler Verbindung schließt
app.use(catchError);

// check ob station berechtigt ist
app.use(authStation);

const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/user', user);
apiRouter.use('/auth', auth);
apiRouter.use('/aushilfen', aushilfen);
apiRouter.use('/angemeldet', angemeldet);
apiRouter.use('/zeiten', zeiten);
apiRouter.use('/onboarding', onboarding);
apiRouter.use('/stationen', stationen);

app.use(errorHandler);
app.use(notFound);

export default app;
