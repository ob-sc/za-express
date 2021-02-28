module.exports = (err, req, res, next) => {
  let msg;
  const isDev = process.env.NODE_ENV === 'development';

  switch (err.code) {
    case 'ENETUNREACH':
      msg = 'Netzwerk nicht erreichbar';
      break;
    case 'ECONNREFUSED':
      msg = 'Verbindung verweigert';
      break;

    default:
      msg = err.code;
      break;
  }

  res.status(500).json({
    error: isDev ? msg : 'Interner Serverfehler',
  });

  next(err);
  // res.status(500).send({ error: msg });
};
