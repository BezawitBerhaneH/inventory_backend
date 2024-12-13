const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Import your sequelize connection
const Role = sequelize.define('Role', {
  roleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'roles', // Ensure the table name matches the actual role table
  timestamps: false, // No timestamps for roles table
});

// Define the SystemAdmin model
const SystemAdmin = sequelize.define('SystemAdmin', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', // Default status is 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'systemadmin', // Ensure the table name matches the actual table
  timestamps: true, // Use Sequelize's built-in timestamp management
});

// Sync the model with the database, creating the table if it doesn't exist
sequelize.sync({ alter: true }) // Use alter: true to update the table structure if needed
  .then(() => {
    console.log("SystemAdmin table has been created or updated.");
  })
  .catch((err) => {
    console.error("Error syncing the model:", err);
  });

module.exports = SystemAdmin;
module.exports = Role;