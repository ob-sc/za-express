import express from 'express';
import auth from '../../middleware/auth';
import { selectMax } from './zeiten';

const router = express.Router();

router.use(auth);

router.post('/max', selectMax);

export default router;
