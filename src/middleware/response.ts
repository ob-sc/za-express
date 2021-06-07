import { RequestHandler } from 'express';
import { notEmptyString } from '../util/helper';

const response: RequestHandler = (req, res, next) => {
  res.okmsg = (response, code = 200) => {
    const isString = notEmptyString(response);

    res.status(code).json({
      message: isString ? response : 'Anfrage erfolgreich',
      code,
      result: isString ? {} : response,
    });
  };

  res.errmsg = (message = 'Fehler bei Operation', code = 500, error) => {
    res.status(code).json({ message, code, error });
  };

  next();
};

export default response;
