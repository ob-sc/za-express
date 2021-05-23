import express from 'express';
import auth from '../../middleware/auth.js';
import { getAushilfen } from './aushilfen.js';

const router = express.Router();

router.use(auth);

router.get('', getAushilfen);

export default router;
