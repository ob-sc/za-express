import { errmsg } from '../util/response';

const auth = (req, res, next) => {
  const { session } = req;
  if (session.user === undefined || session.user.isLoggedIn !== true)
    errmsg(res, 'Nicht angemeldet', 401);
  else next();
};

export default auth;
