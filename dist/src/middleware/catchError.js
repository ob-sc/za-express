"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchError = (req, res, next) => {
    res.catchError = async (callback, close) => {
        try {
            await callback();
        }
        catch (err) {
            if (close !== undefined) {
                await close();
            }
            next(err);
        }
    };
    next();
};
exports.default = catchError;
