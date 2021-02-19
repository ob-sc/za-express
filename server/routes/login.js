var express = require('express');
var router = express.Router();

var query = require('../util/db.js');

/* GET home page. */
router.get('/login', function (req, res) {
  var result = query('SELECT * FROM benutzer');
  res.json({ result });
});

module.exports = router;
