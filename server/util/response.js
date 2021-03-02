export const okmsg = (res, msg, payload) => {
  res.json({ msg, payload });
};

export const errmsg = (res, msg, code, error) => {
  const isValidCode = code !== undefined && !Number.isNaN(code);
  const statusCode = isValidCode ? code : 500;
  const response = { msg };
  if (process.env.NODE_ENV === 'development') response.payload = error;

  res.status(statusCode).json(response);
};
