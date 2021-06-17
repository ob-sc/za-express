"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const username = joi_1.default.string().required().trim().lowercase();
const password = joi_1.default.string().required();
const session = joi_1.default.object().keys({
    username,
    password,
});
exports.default = session;
