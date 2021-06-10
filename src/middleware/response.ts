import { RequestHandler } from 'express';
import { notEmptyString } from '../util/helper';

const response: RequestHandler = (req, res, next) => {
  res.okmsg = (data, code = 200) => {
    const isString = notEmptyString(data);

    res.status(code).json({
      message: isString ? data : 'Anfrage erfolgreich',
      code,
      result: isString ? {} : data,
    });
  };

  res.errmsg = (message = 'Fehler bei Operation', code = 500, error) => {
    res.status(code).json({ message, code, error });
  };

  next();
};

export default response;
