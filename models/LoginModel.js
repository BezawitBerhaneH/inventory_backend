const db = require('./db');

const LoginModel = {
  // Find a user by username
  findUserByUsername: (username, callback) => {
    const sql = "SELECT * FROM systemadmin WHERE username = ?";
    db.query(sql, [username], callback);
  },

  // Update password for a given user
  updatePassword: (userID, hashedPassword, callback) => {
    const sql = "UPDATE systemadmin SET password = ? WHERE userID = ?";
    db.query(sql, [hashedPassword, userID], callback);
  }
};

module.exports = LoginModel;