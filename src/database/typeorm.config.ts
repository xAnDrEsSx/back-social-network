import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: `environments/.env.${process.env.NODE_ENV || 'dev'}` });
const isLocal = process.env.DB_HOST?.includes('pg_container') || process.env.NODE_ENV === 'dev';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, 'src/modules/**/entities/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],
  synchronize: false,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
