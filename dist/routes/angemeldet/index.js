"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.use(auth_1.default);
router.post('', controller_1.anmelden);
router.get('', controller_1.getAnmeldungen);
router.delete('', controller_1.deleteAnmeldung);
exports.default = router;
