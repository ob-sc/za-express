const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const sess = {
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.SESS_LIFETIME),
    sameSite: true,
    secure: process.env.NODE_ENV !== 'development',
  },
  name: process.env.SESS_NAME,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: process.env.SESS_SECRET,
};
const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export { NODE_ENV, PORT, sess, db };
