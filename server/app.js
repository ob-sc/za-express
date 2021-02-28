const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const config = require('./config');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    ...config.session,
    store: new MySQLStore(config.database),
  })
);

app.use('/api', indexRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
