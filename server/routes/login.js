var express = require('express');
var router = express.Router();

var connection = require('../util/connection.js');
var query = require('../util/query.js');

router.get('/', async (req, res) => {
  const conn = await connection().catch(console.log);
  const results = await query(conn, 'SELECT * FROM benutzer').catch(
    console.log
  );
  res.json({ results });
});

module.exports = router;
