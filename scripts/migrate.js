import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  multipleStatements: true,
});

const migrationsDir = path.resolve('migrations');
const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

for (const file of files) {
  const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
  await connection.query(sql);
  console.log(`Aplicada: ${file}`);
}

await connection.end();
