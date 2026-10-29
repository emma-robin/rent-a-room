const env = require('./env');
console.log('Password type:', typeof env.db.password);
console.log('Password set:', Boolean(env.db.password));
const { Pool } = require('pg');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
});

//Successful connection
pool.on('connect', () => {
  console.log(`Connection successful for the ${env.db.database} database`);
});

// Error connecting
pool.on('error', (err) => {
  console.error(`Error on client for ${env.db.database}`, err);
  process.exit(-1);
});

module.exports = pool;