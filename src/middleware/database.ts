import { RequestHandler } from 'express';
import mysql from 'mysql';
import { db } from '../config.js';

const database: RequestHandler = (req, res, next) => {
  res.database = () => {
    const connection = mysql.createConnection(db);
    return {
      query(sql, args) {
        return new Promise((resolve, reject) => {
          connection.query(sql, args, (error, results) => {
            if (error) reject(error);
            else {
              const selectString = sql.substring(0, 5);
              const isSelect = selectString.toLowerCase() === 'select';

              const data = {
                results: Array.isArray(results) ? results : [],
                isEmpty: results.length === 0,
              };

              const queryResult = isSelect
                ? data
                : {
                    ...data,
                    id: results?.insertId,
                    isUpdated: results?.affectedRows > 0,
                  };

              resolve(queryResult);
            }
          });
        });
      },
      // await close() muss immer vor ok-/errmsg kommen
      close() {
        return new Promise((resolve, reject) => {
          connection.end((error) => {
            if (error) reject(error);
            else resolve();
          });
        });
      },
    };
  };

  next();
};

export default database;
