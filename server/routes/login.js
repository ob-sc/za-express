var express = require('express');
var router = express.Router();

var connection = require('../util/connection.js');
var query = require('../util/query.js');

router.get('/', async (req, res, next) => {
  try {
    const conn = await connection();
    const results = await query(conn, 'SELECT * FROM benutzer');
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
