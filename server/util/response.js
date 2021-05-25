const validateResponseCode = (code, def) => {
  return code === undefined || Number.isNaN(code) ? def : code;
};

export const okmsg = (res, payload = {}, code) => {
  const status = validateResponseCode(code, 200);
  res.status(status).json(payload);
};

export const errmsg = (res, msg, code, error) => {
  const status = validateResponseCode(code, 500);
  const message =
    typeof msg === 'string' ? msg : 'Es ist ein Fehler aufgetreten';

  const response = { msg: message };
  if (error !== undefined) response.error = error?.toString();

  res.status(status).json(response);
};
