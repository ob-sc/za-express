"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectMax = void 0;
const sql_1 = __importDefault(require("../../sql"));
const selectMax = async (req, res) => {
    const { query, close } = res.database();
    await res.catchError(async () => {
        const { id, status, firstDayMonth } = req.body;
        const isStudent = status.toLowerCase() === 'student';
        const sql = isStudent ? sql_1.default.zeiten.selMaxStudentID : sql_1.default.zeiten.selMaxID;
        const qry = await query(sql, [id, firstDayMonth]);
        const result = {
            id,
            status: status.toLowerCase(),
            sum: qry.results[0].max,
        };
        res.okmsg(result);
        await close();
    }, close);
};
exports.selectMax = selectMax;
