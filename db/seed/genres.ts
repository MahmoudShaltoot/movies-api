import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { TmdbService } from '../../src/tmdb/tmdb.service';
import { DataSource } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tmdbService = app.get(TmdbService);
  const dataSource = app.get(DataSource);

  try {
    const genres = await tmdbService.getGenres();
    for (const genre of genres) {

      await dataSource.query(
        `INSERT INTO genres (name, external_id) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
        [genre.name, genre.id]
      );
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

export default { seed }
