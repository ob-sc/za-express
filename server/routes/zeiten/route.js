import express from 'express';
import auth from '../../middleware/auth.js';
import { selectMax } from './zeiten.js';

const router = express.Router();

router.use(auth);

router.post('/max', selectMax);

export default router;
