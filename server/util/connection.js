import mysql from 'mysql';
import { db } from '../config.js';

const pool = mysql.createPool(db);

// todo wenn config leer -> error
const connection = async () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(conn);
    });
  });

export default connection;
