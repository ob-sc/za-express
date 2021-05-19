const query = async (conn, sql, params) =>
  new Promise((resolve, reject) => {
    conn.query(sql, params, (err, res) => {
      if (err) reject(err);
      else
        resolve({
          result: res,
          id: res.insertId,
          isEmpty: res.length === 0,
          isUpdated: res.affectedRows > 0,
        });
    });
  });

export default query;
