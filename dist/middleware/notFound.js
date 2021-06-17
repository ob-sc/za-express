"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.errmsg('Ressource nicht gefunden', 404);
};
exports.default = notFound;
