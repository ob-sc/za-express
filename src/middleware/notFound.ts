import { RequestHandler } from 'express';

const notFound: RequestHandler = (req, res) => {
  res.errmsg('Ressource nicht gefunden', 404);
};

export default notFound;
