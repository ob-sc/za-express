"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.sess = exports.port = exports.node_env = void 0;
const parseEnv = (val) => val === undefined ? undefined : Number(val);
const { NODE_ENV, PORT, DB_HOST, DB_USER, DB_PASS, DB_NAME, SESS_NAME, SESS_SECRET, SESS_LIFETIME, } = process.env;
const node_env = NODE_ENV;
exports.node_env = node_env;
const port = parseEnv(PORT) ?? 3000;
exports.port = port;
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
exports.db = db;
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
exports.sess = sess;
