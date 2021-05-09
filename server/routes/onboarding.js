import express from 'express';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';
import { errmsg, okmsg } from '../util/response.js';

const router = express.Router();

router.use(auth);

// neuer ma
router.post('', async (req, res, next) => {
  try {
    const {
      eintritt,
      vorname,
      nachname,
      station,
      position,
      kasse,
      crentstat,
      docuware,
      workflow,
      qlik,
      qlikapps,
      qlikstat,
      vpn,
      handy,
      laptop,
      pc,
      monitore,
      tastatur,
      maus,
      ipad,
      ipadspez,
    } = req.body;

    const conn = await connection();
    const sql =
      'INSERT INTO onboarding (eintritt,vorname,nachname,station,position,kasse,crentstat,docuware,workflow,qlik,qlikapps,qlikstat,vpn,handy,laptop,pc,monitore,tastatur,maus,ipad,ipadspez) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    const createNewMA = await query(conn, sql, [
      eintritt,
      vorname,
      nachname,
      station,
      position,
      kasse,
      crentstat,
      docuware,
      workflow,
      qlik,
      qlikapps,
      qlikstat,
      vpn,
      handy,
      laptop,
      pc,
      monitore,
      tastatur,
      maus,
      ipad,
      ipadspez,
    ]);

    if (!createNewMA.isUpdated) okmsg(res);
    else errmsg(res, 'Fehler bei der Anfrage');

    conn.release();
  } catch (err) {
    next(err);
  }
});

export default router;
