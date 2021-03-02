const notFound = (req, res) => {
  res.status(404).send('Seite nicht gefunden');
};

export default notFound;
