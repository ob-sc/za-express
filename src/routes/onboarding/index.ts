import express from 'express';
import auth from '../../middleware/auth';
import {
  alleMa,
  freigabe,
  getMa,
  neuerMa,
  positionsWechsel,
  stationsWechsel,
  updateMitarbeiter,
} from './routeFns';

const router = express.Router();

router.use(auth);

router.get('', alleMa);
router.post('', neuerMa);
router.put('', updateMitarbeiter);

// get ma mit id
router.get('/ma/:id', getMa);

// freigabe von perso
router.post('/freigabe', freigabe);

router.post('/statw', stationsWechsel);
router.post('/posw', positionsWechsel);

export default router;
