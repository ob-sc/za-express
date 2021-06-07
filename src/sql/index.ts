import { SqlGenerator } from '../types/sql';
import { spaces } from '../util/helper';
import t from './tables';

const sql: SqlGenerator = {
  select(columns, table, ...rest) {
    const arr = Array.from(rest);
    return spaces(['SELECT', columns, 'FROM', table, ...arr]);
  },
  selectAll(table, ...rest) {
    const arr = Array.from(rest);
    return spaces(['SELECT * FROM', table, ...arr]);
  },
  insert(table) {
    return spaces(['INSERT INTO', table, 'SET ?']);
  },
  // update set ? möglich wie insert into set ?
  // dann überall dort auch objekt passen
  update(table, ...rest) {
    const arr = Array.from(rest);
    return spaces(['UPDATE', table, 'SET', ...arr]);
  },
  delete(table, ...rest) {
    const arr = Array.from(rest);
    return spaces(['DELETE FROM', table, ...arr]);
  },
};
const whereID = 'WHERE id=?';

export const angemeldet = {
  selectID: sql.selectAll(t.angemeldet, whereID),
  selectWithName: sql.select(
    'ang.*,ah.vorname,ah.nachname',
    t.ang,
    `JOIN ${t.ah} ON ang.ahid = ah.id`,
    'WHERE ang.station = ?'
  ),
  insert: sql.insert(t.angemeldet),
  deleteID: sql.delete(t.angemeldet, whereID),
};

export const aushilfen = {
  selectNotPassive: sql.selectAll(
    t.aushilfen,
    'WHERE status <> "passiv"',
    'ORDER BY station,nachname'
  ),
};

export const benutzer = {
  selectUser: sql.selectAll(t.benutzer, 'WHERE username = ?'),
};

export const onboarding = {
  selectWithStation: sql.select(
    'onb.*,stat.name AS station_name',
    t.onb,
    `JOIN ${t.stat} ON s.id = onb.station`,
    'ORDER BY status,id DESC'
  ),
  selectwithStationID: sql.select(
    'onb.*,stat.name AS station_name',
    t.onb,
    `JOIN ${t.stat} ON s.id = onb.station`,
    'ORDER BY status,id DESC',
    'WHERE onb.id=?'
  ),
  insert: sql.insert(t.onboarding),
  updStatus: sql.update(t.onboarding, 'status=1', whereID),
  updDomain: sql.update(t.onboarding, 'domain=?', whereID),
  updBitrix: sql.update(t.onboarding, 'bitrix=?', whereID),
  updCrent: sql.update(t.onboarding, 'crent=?', whereID),
  updDocuware: sql.update(t.onboarding, 'docuware=?', whereID),
  updQlik: sql.update(t.onboarding, 'qlik=?', whereID),
  updHardware: sql.update(t.onboarding, 'hardware=?', whereID),
  updNetwork: sql.update(t.onboarding, 'network=?', whereID),
};

export const stationen = {
  selectName: sql.select('name', t.onboarding, whereID),
};
