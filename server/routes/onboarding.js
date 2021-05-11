import express from 'express';
import auth from '../middleware/auth.js';
import connection from '../util/connection.js';
import query from '../util/query.js';
import { errmsg, okmsg } from '../util/response.js';

const router = express.Router();

router.use(auth);

router.get('', async (req, res, next) => {
  try {
    const conn = await connection();
    const sql =
      'SELECT id,status,ersteller,vorname,nachname,eintritt,ort FROM onboarding';

    const allMA = await query(conn, sql);

    if (!allMA.isEmpty) okmsg(res, allMA.result);
    else errmsg(res);
  } catch (err) {
    next(err);
  }
});

// neuer ma
// todo loop über request body und dann direkt sql mit values als string, ohne array in query?
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

    const ersteller = req.session.user.username;

    const conn = await connection();
    const sql =
      'INSERT INTO onboarding (ersteller,eintritt,vorname,nachname,station,position,kasse,crentstat,docuware,workflow,qlik,qlikapps,qlikstat,vpn,handy,laptop,pc,monitore,tastatur,maus,ipad,ipadspez) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    const createNewMA = await query(conn, sql, [
      ersteller,
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

    if (createNewMA.isUpdated) okmsg(res);
    else errmsg(res);

    console.log(createNewMA);

    conn.release();
  } catch (err) {
    next(err);
  }
});

export default router;
