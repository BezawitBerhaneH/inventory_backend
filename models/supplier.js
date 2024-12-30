// models/supplier.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

const Supplier = sequelize.define(
  'Supplier',
  {
    supplierID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'supplier',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'suppliers',
    timestamps: false,
  }
);

// No additional associations here; only defined in `PurchaseOrder`



sequelize
  .sync({ alter: true }) // Use alter: true to update the table structure if needed
  .then(() => {
    console.log('Supplier table has been created or updated.');
  })
  .catch((err) => {
    console.error('Error syncing the model:', err);
  });

module.exports = Supplier;
