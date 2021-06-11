import { RequestHandler } from 'express';

const response: RequestHandler = (req, res, next) => {
  res.okmsg = (data, code = 200) => {
    res.status(code).json({
      message: typeof data === 'string' ? data : 'Anfrage erfolgreich',
      code,
      result: typeof data === 'object' ? data : {},
    });
  };

  res.errmsg = (message = 'Fehler bei Operation', code = 500, error) => {
    res.status(code).json({ message, code, error });
  };

  next();
};

export default response;
