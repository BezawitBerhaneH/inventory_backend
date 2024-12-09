const db = require('./db'); // Assuming db is set up to connect to MySQL with Sequelize

const LoginModel = {
  // Find a user by username
  findUserByUsername: (username, callback) => {
    const sql = "SELECT * FROM systemadmin WHERE username = ?";
    db.query(sql, { replacements: [username], type: db.QueryTypes.SELECT })
      .then(results => callback(null, results))
      .catch(err => callback(err, null));
  },

  // Update password for a given user
  updatePassword: (userID, hashedPassword, callback) => {
    const sql = "UPDATE systemadmin SET password = ? WHERE userID = ?";
    db.query(sql, { replacements: [hashedPassword, userID], type: db.QueryTypes.UPDATE })
      .then(result => callback(null, result))
      .catch(err => callback(err, null));
  }
};

module.exports = LoginModel;
