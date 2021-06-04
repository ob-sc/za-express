const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const SESS_NAME = process.env.SESS_NAME;
const SESS_SECRET = process.env.SESS_SECRET;
const SESS_LIFETIME = process.env.SESS_LIFETIME;

const sess = {
  cookie: {
    httpOnly: true,
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: NODE_ENV !== 'development',
  },
  name: SESS_NAME,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: SESS_SECRET,
};
const db = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
};

export { NODE_ENV, PORT, sess, db };
