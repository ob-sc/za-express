"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updateStation = exports.login = exports.isLoggedIn = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const session_1 = __importDefault(require("../../validation/session"));
const config_1 = require("../../config");
const sql_1 = __importDefault(require("../../sql"));
const createSession = (user) => ({
    username: user.username,
    admin: user.admin,
    station: user.station,
    access: user.access,
    region: user.region,
    extstat: user.extstat?.split(',') ?? [],
    currentStation: user.station,
    onboarding: user.onboarding?.split(',') ?? [],
    isLoggedIn: true,
});
const emptySession = {
    username: '',
    admin: false,
    isLoggedIn: false,
    onboarding: [],
};
const isLoggedIn = (req, res) => {
    if (req.session.user?.isLoggedIn === true)
        res.okmsg(req.session.user);
    else
        res.okmsg(emptySession);
};
exports.isLoggedIn = isLoggedIn;
const login = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { error, value } = session_1.default.validate(req.body);
        if (error)
            throw error;
        const { username, password } = value;
        const isOnboarding = req.headers.host?.includes('onboarding');
        const qry = await query(sql_1.default.benutzer.sel, [username]);
        await close();
        const [user] = qry.results;
        if (qry.isEmpty === true)
            return res.errmsg('Benutzer nicht gefunden', 401);
        if (isOnboarding && user.allow_onboarding !== true)
            return res.errmsg('Benutzer ist nicht für das Onboarding freigegeben', 401);
        bcryptjs_1.default.compare(password, user.password, (err, result) => {
            if (err)
                throw error;
            if (result !== true)
                return res.errmsg('Passwort falsch', 401);
            if (user.active !== true)
                return res.errmsg('Account nicht bestätigt', 400);
            req.session.user = createSession(user);
            res.okmsg(req.session.user);
        });
    }, close);
};
exports.login = login;
const updateStation = async (req, res) => {
    const { body, session } = req;
    if (session.user !== undefined) {
        session.user.currentStation = body.station;
        res.okmsg();
    }
    else
        res.errmsg('Session existiert nicht', 422);
};
exports.updateStation = updateStation;
const logout = async (req, res) => {
    const { session } = req;
    await res.catchError(async () => {
        if (session.user === undefined)
            res.okmsg('Session existiert nicht', 205);
        else
            session.destroy((err) => {
                if (err)
                    throw err;
                res.clearCookie(config_1.sess.name);
                res.okmsg('Logout erfolgreich');
            });
    });
};
exports.logout = logout;
