const { Sequelize } = require('sequelize');

// Set up Sequelize connection to the database
const sequelize = new Sequelize('IMS', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Disable SQL logging for cleaner output
  dialectOptions: {
    connectTimeout: 600000 // 10 seconds, adjust as needed
  }
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the MySQL database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
