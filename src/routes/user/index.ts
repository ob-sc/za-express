import express from 'express';
import { signUp, confirmAccount } from './routeFns';

const router = express.Router();

router.post('', signUp);
router.get('/confirm/:token', confirmAccount);

export default router;
