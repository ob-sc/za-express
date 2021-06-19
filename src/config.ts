import debug from './util/debug';

const parseEnv: (value: string | undefined) => number | undefined = (val) =>
  val === undefined ? undefined : Number(val);

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

debug(process.env);

const node_env = NODE_ENV;
const port = parseEnv(PORT) ?? 3000;

const db_host = DB_HOST ?? '';
const db_user = DB_USER ?? '';
const db_pass = DB_PASS ?? '';
const db_name = DB_NAME ?? '';

const sess_name = SESS_NAME ?? '';
const sess_secret = SESS_SECRET ?? '';
const sess_lifetime = parseEnv(SESS_LIFETIME) ?? 1800000;

const db = {
  host: db_host,
  user: db_user,
  password: db_pass,
  database: db_name,
};

const sess = {
  cookie: {
    httpOnly: true,
    maxAge: sess_lifetime,
    sameSite: true,
    secure: NODE_ENV !== 'development',
  },
  name: sess_name,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: sess_secret,
};

export { node_env, port, sess, db };
