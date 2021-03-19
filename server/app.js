import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { sess, db } from './config';
import { sessionRoutes, userRoutes, aushilfenRoutes } from './routes/index';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

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

app.use(
  session({
    ...sess,
    store: new MySQLStore({ ...db, expiration: sess.cookie.maxAge }),
  })
);

// router
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/users', userRoutes);
apiRouter.use('/session', sessionRoutes);
apiRouter.use('/aushilfen', aushilfenRoutes);

app.use(errorHandler);
app.use(notFound);

export default app;
