const mysql = require('mysql');

// Database connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "IMS" // Ensure the database is created and accessible
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Fetch system admin data
const getSystemAdmins = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM systemadmin";
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

// Insert inventory item
const addInventoryItem = (itemName, quantity, typeID, threshold) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO inventory (itemName, quantity, typeID, threshold) VALUES (?, ?, ?, ?)";
    const values = [itemName, quantity, typeID, threshold];
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result.insertId);
    });
  });
};

// Fetch inventory data (itemName, threshold)
const getInventory = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT itemName, threshold FROM inventory";
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

// Update inventory threshold
const updateThreshold = (id, threshold) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE inventory SET threshold = ? WHERE inventoryID = ?";
    const values = [threshold, id];
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Update system admin data
const updateSystemAdmin = (id, name, email, address, phone, role) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE systemadmin SET name = ?, email = ?, address = ?, phone = ?, role = ? WHERE userID = ?";
    const values = [name, email, address, phone, role, id];
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Delete system admin data
const deleteSystemAdmin = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM systemadmin WHERE userID = ?";
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Fetch dashboard statistics
const getDashboardStats = () => {
  return Promise.all([
    new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) AS totalUsers FROM systemadmin";
      db.query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result[0].totalUsers);
      });
    }),
    new Promise((resolve, reject) => {
      const sql = "SELECT COUNT(*) AS activeInventoryItems FROM inventory";
      db.query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result[0].activeInventoryItems);
      });
    })
  ]);
};

module.exports = {
  getSystemAdmins,
  addInventoryItem,
  getInventory,
  updateThreshold,
  updateSystemAdmin,
  deleteSystemAdmin,
  getDashboardStats
};
