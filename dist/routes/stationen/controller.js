"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatur = exports.selectOptions = void 0;
const sql_1 = __importDefault(require("../../sql"));
const selectOptions = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const qry = await query(sql_1.default.stationen.selOptions);
        await close();
        res.okmsg(qry.results);
    }, close);
};
exports.selectOptions = selectOptions;
const signatur = async (req, res) => {
    const { query, close } = res.database();
    const { id } = req.params;
    await res.catchError(async () => {
        const qry = await query(sql_1.default.stationen.selID, [id]);
        await close();
        const [stations] = qry.results;
        res.okmsg(stations);
    }, close);
};
exports.signatur = signatur;
