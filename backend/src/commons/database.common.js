import pg from 'pg';

export default (() => {
  const pool = new pg.Pool({
    connectionString: process.env.PG_URL,
  });

  if (process.env.NODE_ENV === 'development') {
    pool.options.connectionString = process.env.PG_URL;
  }

  pool.connect((err) => {
    if (err) {
      return console.error('Error:', err.stack);
    }
    return console.log('Database Connected 📶');
  });

  return {
    query: (text, params) => pool.query(text, params),
    ...pool,
  };
})();
