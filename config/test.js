module.exports = {
  api: {
    port: 3000
  },
  postgres: {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    db: process.env.POSTGRES_DB || 'public',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432
  }
};
