export default () => ({
    TMDB_API_URL: process.env.TMDB_API_URL,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),  // default redis port = 6379
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DATABASE_INDEX: parseInt(process.env.REDIS_DATABASE_INDEX || '0', 10), // default database index = 0
    JWT_SECRET: process.env.JWT_SECRET
});
