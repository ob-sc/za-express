"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = (req, res, next) => {
    res.okmsg = (data, code = 200) => {
        const r = {
            message: typeof data === 'string' ? data : 'Anfrage erfolgreich',
            result: typeof data === 'object' ? data : {},
        };
        res.status(code).json(r);
    };
    res.errmsg = (message = 'Es ist ein Fehler aufgetreten', code = 500, error) => {
        const r = { message, error };
        res.status(code).json(r);
    };
    next();
};
exports.default = response;
