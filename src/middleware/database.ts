import mysql from 'mysql';
import debug from '../util/debug';
import { db } from '../config.js';

const database = (req, res, next) => {
  const pool = mysql.createPool(db);
  debug(res);

  res.connection = async () =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        } else resolve(conn);
      });
    });

  res.query = async (conn, sql, params) =>
    new Promise((resolve, reject) => {
      conn.query(sql, params, (err, res) => {
        if (err) reject(err);
        else
          resolve({
            result: res,
            id: res.insertId,
            isEmpty: res.length === 0,
            isUpdated: res.affectedRows > 0,
          });
      });
    });

  next();
};

export default database;
