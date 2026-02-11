const { Pool } = require('pg');

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  null;

const hasLegacyDbConfig =
  !!process.env.DB_HOST &&
  !!process.env.DB_USER &&
  !!process.env.DB_PASSWORD &&
  !!process.env.DB_NAME;

if (!databaseUrl && !hasLegacyDbConfig) {
  throw new Error(
    'Missing database configuration. Set DATABASE_URL/SUPABASE_DB_URL (recommended) or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME.'
  );
}

if (databaseUrl) {
  if (/[<>]/.test(databaseUrl)) {
    throw new Error(
      'Invalid DATABASE_URL: placeholder values detected (for example <region> or <password>). Use the full Supabase URI from Project Settings -> Database -> Connection string.'
    );
  }

  try {
    // Validate URL format early so DB errors are explicit at startup.
    // eslint-disable-next-line no-new
    new URL(databaseUrl);
  } catch (error) {
    throw new Error(
      `Invalid DATABASE_URL format: ${error.message}. Use a valid Postgres URI (postgresql://user:pass@host:port/database).`
    );
  }
}

const shouldUseSsl =
  process.env.DB_SSL === 'true' ||
  /supabase\.co/i.test(databaseUrl || '') ||
  /supabase\.co/i.test(process.env.DB_HOST || '');

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

module.exports = { pool };
