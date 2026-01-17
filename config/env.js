module.exports = {
    development: {
        dbHost: 'localhost',
        dbPort: 27017,
        dbName: 'koa_dev'
    },
    production: {
        dbHost: 'prod-db-server',
        dbPort: 27017,
        dbName: 'koa_prod'
    }
};