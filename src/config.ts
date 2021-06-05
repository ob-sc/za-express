const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
} = process.env;

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
