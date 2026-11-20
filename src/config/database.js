import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { newDb } from 'pg-mem';

let sequelize;

if ((process.env.DATABASE_DIALECT || 'memory') === 'memory') {
  const memoryDb = newDb();
  const pgAdapter = memoryDb.adapters.createPg();
  sequelize = new Sequelize('digital_store', 'postgres', 'postgres', {
    dialect: 'postgres',
    dialectModule: pgAdapter,
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT || 3306),
    dialect: 'mysql',
    dialectModule: await import('mysql2'),
    logging: false,
  });
}

export { sequelize };
