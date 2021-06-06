const angemeldet = {
  selectID: 'SELECT * FROM angemeldet WHERE ahid = ?',
  selectWithName:
    'SELECT ang.*,ah.vorname,ah.nachname FROM angemeldet AS ang INNER JOIN aushilfen AS ah ON ang.ahid = ah.id WHERE ang.station = ?',
  insert: 'INSERT INTO angemeldet SET ?',
  deleteID: 'DELETE FROM angemeldet WHERE id = ?',
};

export { angemeldet };
