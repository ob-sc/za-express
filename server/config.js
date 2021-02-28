const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  session: {
    cookie: {
      secure: process.env.NODE_ENV !== 'development',
    },
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
  },
};

module.exports = config;
