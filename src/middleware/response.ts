import { RequestHandler } from 'express';
import { JSONResponse } from '../../za-types/server/response';

const response: RequestHandler = (req, res, next) => {
  res.okmsg = (data, code = 200) => {
    const r: JSONResponse = {
      message: typeof data === 'string' ? data : 'Anfrage erfolgreich',
      result: typeof data === 'object' ? data : {},
    };

    res.status(code).json(r);
  };

  res.errmsg = (message = 'Es ist ein Fehler aufgetreten', code = 500, error) => {
    const r: JSONResponse = { message, error };
    res.status(code).json(r);
  };

  next();
};

export default response;
