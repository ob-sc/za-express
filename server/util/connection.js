const mysql = require('mysql');

// eslint-disable-next-line node/no-unpublished-require
var config = require('../../config.js');

// todo wenn config leer -> error

module.exports = async () =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection(config);
    connection.connect((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });
