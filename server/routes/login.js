const express = require('express');
const router = express.Router();

const connection = require('../util/connection.js');
const query = require('../util/query.js');

router.get('/', async (req, res, next) => {
  try {
    const conn = await connection();
    const results = await query(conn, 'SELECT * FROM benutzer');
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

export default router;
