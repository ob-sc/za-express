import { RequestHandler } from 'express';
import util from 'util';
import mysql from 'mysql';
import { db } from '../config.js';

const database: RequestHandler = (req, res, next) => {
  res.databaseConnection = () => {
    const connection = mysql.createConnection(db);
    return {
      query(sql, args) {
        // bind(bla)() statt call(bla) weil 3 arguments statt 2 (?)
        return util.promisify(connection.query).bind(connection, sql, args)();
      },
      close() {
        return util.promisify(connection.end).call(connection);
      },
    };
  };

  next();
};

export default database;
