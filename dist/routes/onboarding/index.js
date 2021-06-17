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
router.get('', controller_1.alleMa);
router.post('', controller_1.neuerMa);
router.put('', controller_1.updateMitarbeiter);
router.get('/ma/:id', controller_1.getMa);
router.post('/freigabe', controller_1.freigabe);
router.post('/statw', controller_1.stationsWechsel);
router.post('/posw', controller_1.positionsWechsel);
exports.default = router;
