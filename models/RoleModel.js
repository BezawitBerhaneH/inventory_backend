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

// Insert hardcoded roles if they don't already exist
sequelize.sync().then(() => {
  Role.findOrCreate({
    where: { roleName: 'Admin' }, // Insert 'Admin' role if not present
  });
  Role.findOrCreate({
    where: { roleName: 'Procurement Officer' }, // Insert 'Procurement Officer' role
  });
  Role.findOrCreate({
    where: { roleName: 'Department' }, // Insert 'Department' role
  });
  Role.findOrCreate({
    where: { roleName: 'Inventory Admin' }, // Insert 'Inventory Admin' role
  });
  Role.findOrCreate({
    where: { roleName: 'Inventory ' }, // Insert 'Inventory Admin' role
  });
});

module.exports = Role;
