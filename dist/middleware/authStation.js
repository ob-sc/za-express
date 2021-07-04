"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql_1 = __importDefault(require("../sql"));
const authStation = (req, res, next) => {
    const { user } = req.session;
    const extstat = user?.extstat ?? [];
    const allowedStations = [user?.station, ...extstat];
    res.authStation = (station) => {
        const { query, close } = res.database();
        if (allowedStations[1] === '*')
            return true;
        if (user?.region !== null) {
            const userRegion = user?.region?.toLowerCase();
            query(sql_1.default.stationen.selRegion, [userRegion, userRegion])
                .then((data) => {
                close();
                for (const item of data.results) {
                    allowedStations.push(item.id);
                }
            })
                .catch(() => {
                close();
            });
        }
        const authStations = allowedStations.filter((astat) => astat === station);
        return authStations.length > 0;
    };
    next();
};
exports.default = authStation;
