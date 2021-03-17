import { errmsg } from '../util/response';

const errorHandler = (err, req, res, next) => {
  // database error
  if (err.code !== undefined)
    switch (err.code) {
      case 'ENETUNREACH':
        errmsg(res, 'Netzwerk nicht erreichbar', 500, err);
        break;
      case 'ECONNREFUSED':
        errmsg(res, 'Verbindung verweigert', 500, err);
        break;
      default:
        errmsg(res, 'Interner Serverfehler', 500, err);
        break;
    }

  // validation error
  if (err.isJoi === true)
    switch (err.details[0].context.label) {
      case 'username':
        errmsg(res, 'Benutzername nicht gültig', 400, err);
        break;
      case 'password':
        errmsg(res, 'Passwort nicht gültig', 400, err);
        break;
      case 'repeat_password':
        errmsg(res, 'Passwort wiederholen nicht gültig', 400, err);
        break;
      case 'station':
        errmsg(res, 'Stationsauswahl nicht gültig', 400, err);
        break;
      default:
        errmsg(res, 'Fehler bei Überprüfung der Angaben', 400, err);
        break;
    }

  next(err);
};

export default errorHandler;
