"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConfig = void 0;
const helper_1 = require("./helper");
const testConfig = (env) => {
    const errors = [];
    const hasNODE_ENV = env.NODE_ENV !== undefined;
    if (hasNODE_ENV === false)
        errors.push('NODE_ENV');
    const hasPORT = env.PORT !== undefined;
    if (hasPORT === false)
        errors.push('PORT');
    const hasDB_HOST = env.DB_HOST !== undefined;
    if (hasDB_HOST === false)
        errors.push('DB_HOST');
    const hasDB_USER = env.DB_USER !== undefined;
    if (hasDB_USER === false)
        errors.push('DB_USER');
    const hasDB_PASS = env.DB_PASS !== undefined;
    if (hasDB_PASS === false)
        errors.push('DB_PASS');
    const hasDB_NAME = env.DB_NAME !== undefined;
    if (hasDB_NAME === false)
        errors.push('DB_NAME');
    const hasSESS_NAME = env.SESS_NAME !== undefined;
    if (hasSESS_NAME === false)
        errors.push('SESS_NAME');
    const hasSESS_SECRET = env.SESS_SECRET !== undefined;
    if (hasSESS_SECRET === false)
        errors.push('SESS_SECRET');
    const hasSESS_LIFETIME = env.SESS_LIFETIME !== undefined;
    if (hasSESS_LIFETIME === false)
        errors.push('SESS_LIFETIME');
    return {
        errors: errors.length,
        string: helper_1.spaces(errors),
    };
};
exports.testConfig = testConfig;
