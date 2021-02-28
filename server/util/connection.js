const mysql = require('mysql');

const { database } = require('../config.js');

// todo wenn config leer -> error

module.exports = async () =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection(database);
    connection.connect((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });
