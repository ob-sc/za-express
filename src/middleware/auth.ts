const auth = (req, res, next) => {
  const { session } = req;
  if (session.user === undefined || session.user.isLoggedIn !== true)
    res.errmsg('Nicht angemeldet', 401);
  else next();
};

export default auth;
