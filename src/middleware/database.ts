import { RequestHandler } from 'express';
import mysql from 'mysql';
import { db } from '../config';

const database: RequestHandler = (req, res, next) => {
  res.database = () => {
    const connection = mysql.createConnection({
      ...db,
      // nxt() wegen shadow next von express
      typeCast: (field, nxt) => {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1'; // 1 = true, 0 = false
        }
        return nxt();
      },
    });
    return {
      query(sql, args) {
        return new Promise((resolve, reject) => {
          connection.query(sql, args, (error, results) => {
            if (error) reject(error);
            else {
              const selectString = sql.substring(0, 5);
              const isSelect = selectString.toLowerCase() === 'select';

              const array = Array.isArray(results) ? results : [];

              const data = {
                results: array,
                isEmpty: array.length === 0,
              };

              const queryResult = isSelect
                ? data
                : {
                    ...data,
                    id: results?.insertId,
                    isUpdated: results?.changedRows > 0,
                  };

              resolve(queryResult);
            }
          });
        });
      },
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
