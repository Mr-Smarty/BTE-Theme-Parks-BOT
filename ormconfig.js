const { database, env } = require('./config.json');

module.exports = {
    type: 'mariadb',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    synchronize: env !== 'production',
    entities: ['dist/**/*.js'],
    migrations: ['dist/migration/**/*.js'],
    subscribers: ['src/subscriber/**/*.js'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    }
};
