"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = (req, res, next) => {
    const { session } = req;
    if (session.user === undefined || session.user.isLoggedIn !== true)
        res.errmsg('Nicht angemeldet', 401);
    else
        next();
};
exports.default = auth;
