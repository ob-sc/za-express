import { RequestHandler } from 'express';
import debug from '../util/debug';

// connection muss noch selber geschlossen werden, dieses close ist nur falls es eine exception gibt

const catchError: RequestHandler = (req, res, next) => {
  res.catchError = async (callback, close) => {
    try {
      await callback();
    } catch (err) {
      if (close !== undefined) {
        await close();
        debug('Verbindung wegen Fehler geschlossen');
      }
      next(err);
    }
  };

  next();
};

export default catchError;
