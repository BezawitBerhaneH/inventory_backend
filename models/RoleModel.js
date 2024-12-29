const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db");

const Role = sequelize.define(
  "Role",
  {
    roleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Role;
