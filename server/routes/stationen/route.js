import express from 'express';
import { alleStationen, signatur } from './stationen.js';

const router = express.Router();

router.get('', alleStationen);
router.get('/sig/:id', signatur);

export default router;
