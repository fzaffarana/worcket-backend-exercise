const { Client } = require('pg');
const {
  postgres: { user, password, db, host }
} = require('../config');

/**
 * Return to postgres connection
 *
 * @returns {object} Postgres connection
 * @public
 */
exports.getConnection = async () => {
  const client = new Client({
    connectionString: `postgresql://${user}:${password}@${host}:5432/${db}`
  });
  await client.connect();

  return client;
};
