import Genre from './genres'
import User from './users'

async function seed() {
    // Seed genres
    Genre.seed();

    // Seed users
    User.seed();
}

seed();