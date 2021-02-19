// eslint-disable-next-line node/no-unpublished-require
var config = require('../../config.js');

var mysql = require('mysql');
var connection = mysql.createConnection(config);

function query(q) {
  try {
    var result = {};
    connection.connect();

    connection.query(q, function (err, rows, fields) {
      if (err) throw err;

      result = { rows, fields };
    });

    connection.end();
  } catch (err) {
    result = err;
  }

  return result;
}

module.exports = query;
