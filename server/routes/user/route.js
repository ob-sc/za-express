import express from 'express';
import { signUp } from './user';

const router = express.Router();

router.post('', signUp);

export default router;
