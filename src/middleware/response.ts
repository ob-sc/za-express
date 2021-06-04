const validateStatusCode = (code) => {
  if (isNaN(code)) throw new Error('Ungültiger Statuscode');
  return code;
};

const response = (req, res, next) => {
  res.okmsg = (message = 'ok', result = {}, code = 200) => {
    const status = validateStatusCode(code);
    return res.status(status).json({ message, result, code });
  };

  res.errmsg = (message = 'Fehler', code = 500, error) => {
    const status = validateStatusCode(code);
    return res
      .status(status)
      .json({ message, code, error: error !== undefined ? error : null });
  };

  next();
};

export default response;
