const query = async (conn, q, params) =>
  new Promise((resolve, reject) => {
    conn.query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve({ result: res, isEmpty: res.length === 0 });
    });
  });

export default query;
