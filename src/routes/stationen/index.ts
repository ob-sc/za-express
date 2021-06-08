import express from 'express';
import { selectOptions, signatur } from './routeFns';

const router = express.Router();

router.get('', selectOptions);
router.get('/sig/:id', signatur);

export default router;
