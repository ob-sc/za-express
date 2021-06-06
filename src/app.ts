import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import { isDev } from './util/helper';
import { sess, db } from './config';
import {
  response,
  database,
  catchError,
  errorHandler,
  notFound,
} from './middleware/';
import {
  auth,
  user,
  aushilfen,
  angemeldet,
  zeiten,
  onboarding,
  stationen,
} from './routes';

// todo morgan = https://github.com/expressjs/morgan/issues/190
// todo mysqlstore import?
const logger = require('morgan');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

app.set('trust proxy', 1);

app.use(logger(isDev ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: /starcar\.local$/, credentials: true }));

// res.okmsg & res.errmsg
app.use(response);

// res.connection & res.query
app.use(database);

// try / catch block der die Verbindung schließt
app.use(catchError);

app.use(
  session({
    ...sess,
    store: new MySQLStore({ ...db, expiration: sess.cookie.maxAge }),
  })
);

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
