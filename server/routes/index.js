var express = require('express');
var router = express.Router();

var query = require('../util/db.js');

var login = require('./login.js');

/* GET home page. */
router.get('/', function (req, res) {
  var result = query('SELECT * FROM benutzer');
  res.json({ result });
});

// router.use('/login', login);

module.exports = router;
