"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAccount = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sql_1 = __importDefault(require("../../sql"));
const user_1 = __importDefault(require("../../validation/user"));
const mail_1 = require("./mail");
const signUp = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { error, value } = user_1.default.validate(req.body);
        if (error)
            throw error;
        const { username, password, station } = value;
        const qry = await query(sql_1.default.benutzer.sel, [username]);
        if (qry.isEmpty !== true) {
            await close();
            return res.errmsg('Benutzer bereits vorhanden', 409);
        }
        bcryptjs_1.default.hash(password, 10, async (err, hash) => {
            if (err)
                throw err;
            const qry2 = await query(sql_1.default.benutzer.ins, {
                username,
                password: hash,
                station,
            });
            if (qry2.isUpdated === true) {
                const token = crypto_1.default.randomBytes(20).toString('hex');
                const qry3 = await query(sql_1.default.account.ins, {
                    id: qry2.id,
                    token,
                });
                await close();
                const email = `${username}@starcar.de`;
                await mail_1.confirmMail({ token, to: email });
                await mail_1.infoMail({ user: username });
                if (qry3.isUpdated)
                    return res.okmsg();
                return res.errmsg('Kein token eingetragen');
            }
            await close();
            res.errmsg('Kein Benutzer eingetragen');
        });
    }, close);
};
exports.signUp = signUp;
const confirmAccount = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { token } = req.params;
        const sql = 'SELECT * FROM account WHERE token = ?';
        const qry = await query(sql, [token]);
        if (qry.isEmpty === true)
            res.errmsg('Token nicht gefunden');
        else {
            const [tokenResult] = qry.results;
            const sinceReg = Date.now() - new Date(tokenResult.reg_date).getTime();
            if (sinceReg / 1000 / 60 / 60 > 24)
                res.errmsg('Link abgelaufen', 410);
            else {
                const qry2 = await query(sql_1.default.benutzer.updActive, [tokenResult.id]);
                if (qry2.isUpdated)
                    res.okmsg('Account erfolgreich bestätigt');
                else
                    res.errmsg('Account nicht bestätigt');
            }
            await query(sql_1.default.account.del, [token]);
        }
        await close();
    }, close);
};
exports.confirmAccount = confirmAccount;
