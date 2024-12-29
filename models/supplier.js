const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db");

const supplier = sequelize.define(
  "supplier",
  {
    supplierID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "suppliers",
    timestamps: false,
  }
);

module.exports = supplier;
