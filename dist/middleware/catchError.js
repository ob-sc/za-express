"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("../util/debug"));
const catchError = (req, res, next) => {
    res.catchError = async (callback, close) => {
        try {
            await callback();
        }
        catch (err) {
            if (close !== undefined) {
                await close();
                debug_1.default('DB Verbindung wegen Fehler geschlossen');
            }
            next(err);
        }
    };
    next();
};
exports.default = catchError;
