import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { userRoutes } from './routes/index';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

// todo morgan = https://github.com/expressjs/morgan/issues/190
// todo mysqlstore import?
// todo config import?
const logger = require('morgan');
const MySQLStore = require('express-mysql-session')(session);
import { sess, db } from './config';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    ...sess,
    store: new MySQLStore(db),
  })
);

// router
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/users', userRoutes);

app.use(errorHandler);
app.use(notFound);

export default app;
