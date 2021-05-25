import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import { sess, db } from './config';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';
import {
  auth,
  user,
  aushilfen,
  angemeldet,
  zeiten,
  onboarding,
} from './routes/index';

// todo morgan = https://github.com/expressjs/morgan/issues/190
// todo mysqlstore import?
const logger = require('morgan');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: /starcar\.local$/, credentials: true }));

app.use(
  session({
    ...sess,
    store: new MySQLStore({ ...db, expiration: sess.cookie.maxAge }),
  })
);

// router
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/user', user);
apiRouter.use('/auth', auth);
apiRouter.use('/aushilfen', aushilfen);
apiRouter.use('/angemeldet', angemeldet);
apiRouter.use('/zeiten', zeiten);
apiRouter.use('/onboarding', onboarding);

app.use(errorHandler);
app.use(notFound);

export default app;
