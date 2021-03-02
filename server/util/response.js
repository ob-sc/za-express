export const okmsg = (res, msg) => {
  res.json({ msg });
};

export const errmsg = (res, msg, code) => {
  const isValidCode = code !== undefined && !Number.isNaN(code);
  res.status(isValidCode ? code : 500).json({ err: msg });
};
