"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err.isJoi === true)
        switch (err.details[0].context.label) {
            case 'username':
                res.errmsg('Benutzername nicht gültig', 400, err);
                break;
            case 'password':
                res.errmsg('Passwort nicht gültig', 400, err);
                break;
            case 'repeat_password':
                res.errmsg('Wiederholtes Passwort nicht gültig', 400, err);
                break;
            case 'station':
                res.errmsg('Stationsauswahl nicht gültig', 400, err);
                break;
            default:
                res.errmsg('Fehler bei Überprüfung der Angaben', 400, err);
                break;
        }
    else if (err.code !== undefined)
        switch (err.code) {
            case 'ENETUNREACH':
                res.errmsg('Netzwerk nicht erreichbar', 500, err);
                break;
            case 'ECONNREFUSED':
                res.errmsg('Verbindung verweigert', 500, err);
                break;
            default:
                res.errmsg(err.message, 500, err);
                break;
        }
    next(err);
};
exports.default = errorHandler;
