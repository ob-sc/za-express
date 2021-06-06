import { RequestHandler } from 'express';
import { checkObject, notEmptyString } from '../util/helper';

const response: RequestHandler = (req, res, next) => {
  res.okmsg = (response, code = 200) => {
    const isString = notEmptyString(response);
    const isObject = checkObject(response);

    res.status(code).json({
      message: isString ? response : 'Anfrage erfolgreich',
      code,
      result: isObject ? response : {},
    });
  };

  res.errmsg = (message = 'Fehler bei Operation', code = 500, error) => {
    res.status(code).json({ message, code, error });
  };

  next();
};

export default response;
