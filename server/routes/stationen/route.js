import express from 'express';
import { selectOptions, signatur } from './stationen.js';

const router = express.Router();

router.get('', selectOptions);
router.get('/sig/:id', signatur);

export default router;
