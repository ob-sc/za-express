const validateResponseCode = (code, def) => {
  const isValidCode = code !== undefined && !Number.isNaN(code);
  return isValidCode ? code : def;
};

export const okmsg = (res, payload = {}, code) => {
  const status = validateResponseCode(code, 200);
  res.status(status).json(payload);
};

export const errmsg = (res, msg, code, error) => {
  const status = validateResponseCode(code, 500);
  const response = { msg };
  if (process.env.NODE_ENV === 'development') response.payload = error;

  res.status(status).json(response);
};
