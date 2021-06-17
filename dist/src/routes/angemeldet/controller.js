"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnmeldung = exports.getAnmeldungen = exports.anmelden = void 0;
const sql_1 = __importDefault(require("../../sql"));
const anmelden = async (req, res) => {
    const { query, close } = res.database();
    const { ahid, date, start } = req.body;
    const anmeldung = {
        ahid,
        date,
        start,
        station: req.session.user?.station ?? 0,
    };
    await res.catchError(async () => {
        const qry = await query(sql_1.default.angemeldet.selId, [ahid]);
        if (qry.isEmpty === false) {
            await close();
            return res.errmsg('Aushilfe ist bereits angemeldet', 409);
        }
        await query(sql_1.default.angemeldet.ins, anmeldung);
        await close();
        res.okmsg();
    }, close);
};
exports.anmelden = anmelden;
const getAnmeldungen = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const qry = await query(sql_1.default.angemeldet.selJoinAh, [
            req.session.user?.currentStation,
        ]);
        await close();
        res.okmsg(qry.results);
    }, close);
};
exports.getAnmeldungen = getAnmeldungen;
const deleteAnmeldung = async (req, res) => {
    const { query, close } = res.database();
    const { id } = req.body;
    await res.catchError(async () => {
        await query(sql_1.default.angemeldet.del, [id]);
        await close();
        res.okmsg();
    }, close);
};
exports.deleteAnmeldung = deleteAnmeldung;
