import express from 'express';
import auth from '../../middleware/auth';
import { getAushilfen } from './routeFns';

const router = express.Router();

router.use(auth);

router.get('', getAushilfen);

export default router;
