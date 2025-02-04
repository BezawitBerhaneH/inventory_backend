const { DataTypes } = require("sequelize");
const sequelize = require("./db"); // Assuming `db` exports a Sequelize instance

const Inventory = sequelize.define(
  "Inventory",
  {
    inventoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "inventory",
    timestamps: false, // Disable timestamps if not needed
  }
);

// Sync the model with the database
sequelize
  .sync({ alter: true }) // Updates table structure if necessary
  .then(() => {
    console.log("");
  })
  .catch((err) => {
    console.error("Error syncing the Inventory model:", err);
  });

module.exports = Inventory;
