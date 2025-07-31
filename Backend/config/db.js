/**
 * Database Configuration
 * Sequelize setup for PostgreSQL connection
 * Handles database connection and synchronization
 */

const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize('postgres', 'postgres', 'admin123', {
  host: 'localhost',
  dialect: 'postgres',
   port: 5432,
});

db.authenticate()
  .then(() => {
    console.log('Sequelize connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database with Sequelize:', err);
  });

module.exports = {
  db
};
