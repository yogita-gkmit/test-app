import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isCompiled = __filename.endsWith('.js');
const isRds =
  process.env.DB_HOST?.includes('rds.amazonaws.com');

export const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: isRds
    ? { rejectUnauthorized: false }
    : false,
  extra: isRds
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {},

  schema: 'public',

  entities: [
    isCompiled ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts',
  ],
  migrations: [
    isCompiled
      ? 'dist/src/migrations/*.js'
      : 'src/migrations/*.ts',
  ],

  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

export const dataSource = new DataSource(config);
