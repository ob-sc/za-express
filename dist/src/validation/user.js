"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const username = joi_1.default.string().required().trim().lowercase().pattern(new RegExp('^[a-z.-]{1,}$'));
const password = joi_1.default.string()
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})'));
const repeat_password = joi_1.default.any().equal(joi_1.default.ref('password')).required();
const station = joi_1.default.number().required();
const user = joi_1.default.object().keys({
    username,
    password,
    repeat_password,
    station,
});
exports.default = user;
