import express from 'express';
import { okmsg } from '../util/response.js';
import auth from '../middleware/auth.js';
import mail from '../util/mail.js';

const router = express.Router();

router.use(auth);

router.get('', async (req, res, next) => {
  try {
    await mail();
    okmsg(res);
  } catch (err) {
    next(err);
  }
});

export default router;
