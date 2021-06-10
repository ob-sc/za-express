import express from 'express';
import auth from '../../middleware/auth';
import { getAushilfen } from './controller';

const router = express.Router();

router.use(auth);

router.get('', getAushilfen);

export default router;
