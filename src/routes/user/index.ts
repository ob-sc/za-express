import express from 'express';
import { confirmAccount, signUp } from './controller';

const router = express.Router();

router.post('', signUp);
router.get('/confirm/:token', confirmAccount);

export default router;
