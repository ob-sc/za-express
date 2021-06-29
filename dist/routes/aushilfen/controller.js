"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAushilfen = void 0;
const sql_1 = __importDefault(require("../../sql"));
const getAushilfen = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const qry = await query(sql_1.default.aushilfen.sel);
        await close();
        res.okmsg(qry.results);
    }, close);
};
exports.getAushilfen = getAushilfen;
