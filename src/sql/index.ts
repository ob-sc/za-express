import { spaces } from '../util/helper';

const sql = {
  account: {
    selToken: 'SELECT * FROM account WHERE token = ?',
    ins: 'INSERT INTO account SET ?',
    del: 'DELETE FROM account WHERE token = ?',
  },
  angemeldet: {
    selId: 'SELECT * FROM angemeldet WHERE id = ?',
    selJoinAh: spaces([
      'SELECT ang.*,ah.vorname,ah.nachname',
      'FROM angemeldet as ang',
      `JOIN aushilfen as ah ON ang.ahid = ah.id`,
      'WHERE ang.station = ?',
    ]),
    ins: 'INSERT INTO angemeldet SET ?',
    del: 'DELETE FROM angemeldet WHERE id = ?',
  },
  aushilfen: {
    sel: spaces([
      'SELECT * FROM aushilfen',
      'WHERE status <> "passiv"',
      'ORDER BY station, nachname',
    ]),
  },
  benutzer: {
    sel: 'SELECT * FROM benutzer WHERE username = ?',
    ins: 'INSERT INTO benutzer SET ?',
    updActive: 'UPDATE benutzer SET active = 1 WHERE id = ?',
  },
  onboarding: {
    selJoinStation: spaces([
      'SELECT onb.*, stat.name AS station_name',
      'FROM onboarding as onb',
      `JOIN stationen as stat ON stat.id = onb.station`,
      'ORDER BY status, id DESC',
    ]),
    selJoinStationID: spaces([
      'SELECT onb.*, stat.name AS station_name',
      'FROM onboarding as onb',
      `JOIN stationen as stat ON stat.id = onb.station`,
      'WHERE onb.id = ?',
      'ORDER BY status, id DESC',
    ]),
    ins: 'INSERT INTO onboarding SET ?',
    updStatus: 'UPDATE onboarding SET status = 1 WHERE id = ?',
    updAnzeigen: 'UPDATE onboarding SET anzeigen = 1 WHERE id = ?',
    updDomain: 'UPDATE onboarding SET domain = ? WHERE id = ?',
    updBitrix: 'UPDATE onboarding SET bitrix = ? WHERE id = ?',
    updCrent: 'UPDATE onboarding SET crent = ? WHERE id = ?',
    updDocuware: 'UPDATE onboarding SET docuware = ? WHERE id = ?',
    updQlik: 'UPDATE onboarding SET qlik = ? WHERE id = ?',
    updHardware: 'UPDATE onboarding SET hardware = ? WHERE id = ?',
    updNetwork: 'UPDATE onboarding SET network = ? WHERE id = ?',
  },
  stationen: {
    selID: 'SELECT * FROM stationen WHERE id = ?',
    selOptions: 'SELECT id AS optval, name AS optlabel FROM stationen',
    selRegion: 'SELECT id FROM stationen WHERE LOWER(region) = ? OR LOWER(region2) = ?',
    selName: 'SELECT name FROM stationen WHERE id = ?',
  },
  zeiten: {
    selMaxID: spaces([
      'SELECT sum(gehalt) AS max',
      'FROM zeiten',
      'WHERE id = ?',
      'AND LOWER(ahmax) <> "student"',
      'AND datum BETWEEN ? AND CURDATE()',
    ]),
    selMaxStudentID: spaces([
      'SELECT sum(arbeitszeit) as max',
      'FROM zeiten',
      'WHERE id = ?',
      'AND yearweek(DATE(datum), 1) = yearweek(CURDATE(), 1)',
    ]),
  },
};

export default sql;
