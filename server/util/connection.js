const mysql = require('mysql');

const { host, user, password, database } = require('../config.js');

// todo wenn config leer -> error

module.exports = async () =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host,
      user,
      password,
      database,
    });
    connection.connect((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });
