const notFound = (req, res) => {
  res.errmsg('Ressource nicht gefunden', 404);
};

export default notFound;
