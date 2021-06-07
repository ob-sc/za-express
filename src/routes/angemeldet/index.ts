import express from 'express';
import auth from '../../middleware/auth';
import { anmelden, deleteAnmeldung, getAnmeldungen } from './routeFns';

const router = express.Router();

router.use(auth);

router.post('', anmelden);
router.get('', getAnmeldungen);
router.delete('', deleteAnmeldung);

export default router;
