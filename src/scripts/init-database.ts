import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

async function initializeDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  })

  await dataSource.initialize();
  const result = await dataSource.query(`SELECT 1 FROM pg_database WHERE datname='${process.env.DB_NAME}';`);

  if (result.length === 0) {
    await dataSource.query(`CREATE DATABASE ${process.env.DB_NAME};`);
    console.log(`Database ${process.env.DB_NAME} created successfully!`);
  } else {
    console.log(`Database ${process.env.DB_NAME} already exists.`);
  }

  await dataSource.destroy();
}

initializeDatabase()
  .then(() => {
    console.log('Database initialization completed!')
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
    process.exit(1);
  });
