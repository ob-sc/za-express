import express from 'express';
import { isLoggedIn, login, logout, updateStation } from './controller';

const router = express.Router();

router.post('', login);
router.get('', isLoggedIn);
router.put('', updateStation);
router.delete('', logout);

export default router;
