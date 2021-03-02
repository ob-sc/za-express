const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const sess = {
  cookie: {
    secure: process.env.NODE_ENV !== 'development',
  },
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: false,
};
const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export { NODE_ENV, PORT, sess, db };
