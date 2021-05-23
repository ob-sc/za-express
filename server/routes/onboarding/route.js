import express from 'express';
import auth from '../../middleware/auth.js';
import {
  alleMa,
  freigabe,
  getMa,
  neuerMa,
  updateMitarbeiter,
} from './onboarding.js';

const router = express.Router();

router.use(auth);

router.get('', alleMa);
router.post('', neuerMa);
router.put('', updateMitarbeiter);

// freigabe von perso
router.get('/freigabe/:id', freigabe);

// get ma mit id
router.get('/ma/:id', getMa);

export default router;
