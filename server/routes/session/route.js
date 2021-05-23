import express from 'express';
import { isLoggedIn, login, logout, updateStation } from './session.js';

const router = express.Router();

router.get('', isLoggedIn);
router.post('', login);
router.put('', updateStation);
router.delete('', logout);

export default router;
