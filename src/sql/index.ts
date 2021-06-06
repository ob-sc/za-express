const S = 'SELECT ';
const SEL = 'SELECT * FROM ';
const INS = 'INSERT INTO ';
const SET = ' SET ';
const WHERE = ' WHERE ';

const angemeldet = {
  selectID: 'SELECT * FROM angemeldet WHERE ahid = ?',
  selectWithName:
    'SELECT ang.*,ah.vorname,ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?',
  insert: 'INSERT INTO angemeldet SET ?',
  deleteID: 'DELETE FROM angemeldet WHERE id = ?',
};

const aushilfen = {
  selectNotPassive:
    'SELECT * FROM aushilfen WHERE status <> "passiv" ORDER BY station, nachname',
};

const benutzer = {
  selectUser: 'SELECT * FROM benutzer WHERE username = ?',
};

const onboarding = {
  selectWithStation:
    'SELECT o.*,s.name AS station_name FROM onboarding AS o JOIN stationen AS s ON s.id = o.ort ORDER BY status,id DESC',
  selectwithStationID:
    'SELECT o.*,s.name AS station_name FROM onboarding AS o JOIN stationen AS s ON s.id = o.ort ORDER BY status,id DESC',
};

export { angemeldet, aushilfen, benutzer, onboarding };
