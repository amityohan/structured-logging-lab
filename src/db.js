const { Pool } = require('pg');
const { logger } = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async () => {
  logger.info('database.connect.started');
  try {
    await pool.query('SELECT NOW()');
    logger.info('database.connect.completed');
  } catch (err) {
    logger.warn({ error: err.name }, 'database.connect.failed');
  }
};

const queryDb = async (text, params, requestLogger = logger) => {
  requestLogger.debug('database.query.started');
  const res = await pool.query(text, params);
  requestLogger.debug('database.query.completed');
  return res;
};

module.exports = { connectDb, queryDb, pool };
