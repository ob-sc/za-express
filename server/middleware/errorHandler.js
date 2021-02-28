module.exports = (err, req, res, next) => {
  var msg;
  switch (err.code) {
    case 'ENETUNREACH':
      msg = 'Netzwerk nicht erreichbar';
      break;

    default:
      msg = 'Interner Serverfehler';
      break;
  }

  next(err);

  console.log(err);
  res.status(500).json({ error: msg });
  // res.status(500).send({ error: msg });
};
