import knex, { Knex } from 'knex';

const useDatabaseUrl = Boolean(process.env.DATABASE_URL);
const sslEnabled = process.env.DB_SSL === 'true' || useDatabaseUrl; // habilita SSL por padrão se usar DATABASE_URL (Supabase)

const connection: Knex.PgConnectionConfig | string = useDatabaseUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'postgres',
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
    };

const config: Knex.Config = {
  client: 'pg',
  connection,
  pool: { min: 2, max: 10 },
  debug: true,
};

const db = knex(config);
export default db;