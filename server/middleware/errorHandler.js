import { errmsg } from '../util/response';

const errorHandler = (err, req, res, next) => {
  // database error
  if (err.code !== undefined)
    switch (err.code) {
      case 'ENETUNREACH':
        errmsg(res, 'Netzwerk nicht erreichbar');
        break;
      case 'ECONNREFUSED':
        errmsg(res, 'Verbindung verweigert');
        break;
      default:
        errmsg(res, `Interner Serverfehler ${err.code}`);
        break;
    }

  // validation error
  if (err.isJoi === true)
    switch (err.details[0].context.label) {
      case 'username':
        errmsg(res, 'Benutzername ist nicht gültig');
        break;
      case 'password':
        errmsg(res, 'Passwort ist nicht gültig');
        break;
      case 'repeat_password':
        errmsg(res, 'Die Passwörter sind nicht identisch');
        break;
      case 'station':
        errmsg(res, 'Fehler bei Auswahl der Station');
        break;
      default:
        errmsg(res, 'Fehler bei Überprüfung der Angaben');
        break;
    }

  next(err);
};

export default errorHandler;
