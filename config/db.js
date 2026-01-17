const path = require('path')
const {Sequelize} = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    dialect: 'sqlite',
    dialectModule: sqlite3,
    storage: path.join(__dirname, process.env.DB_STORAGE),
    logging: false
});

module.exports = sequelize;