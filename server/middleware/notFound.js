import { errmsg } from '../util/response';

const notFound = (req, res) => {
  errmsg(res, 'Ressource nicht gefunden', 404);
};

export default notFound;
