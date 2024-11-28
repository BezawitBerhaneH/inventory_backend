const db = require('./db');

const SystemAdminModel = {
  getAll: (callback) => {
    const sql = "SELECT * FROM systemadmin";
    db.query(sql, callback);
  },
  update: (id, data, callback) => {
    const sql = "UPDATE systemadmin SET name = ?, email = ?, address = ?, phone = ?, role = ? WHERE userID = ?";
    db.query(sql, [data.name, data.email, data.address, data.phone, data.role, id], callback);
  },
  delete: (id, callback) => {
    const sql = "DELETE FROM systemadmin WHERE userID = ?";
    db.query(sql, [id], callback);
  },
  insert: (username, password, name, email, address, phone, role, createdAt, updatedAt, callback) => {
    const sql = "INSERT INTO systemadmin (username, password, name, email, address, phone, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [username, password, name, email, address, phone, role, createdAt, updatedAt], callback);
  },
  getDashboardStats: (callback) => {
    const systemAdminCountQuery = "SELECT COUNT(*) AS totalUsers FROM systemadmin";
    db.query(systemAdminCountQuery, callback);
  },
};

module.exports = SystemAdminModel;
