import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const full_name = process.env.ADMIN_FULL_NAME || 'Admin';
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await dataSource.query(
        `INSERT INTO users (full_name, username, password, is_admin) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING`,
        [full_name, username, hashedPassword, true]
      );
    }

    console.log('Users seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

export default { seed }
