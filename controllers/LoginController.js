const bcrypt = require("bcrypt");
const LoginModel = require("../models/LoginModel");

const LoginController = {
  // Controller method for user login
  loginUser: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user by username
    LoginModel.findUserByUsername(username, async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Check if it's the first login
      if (user.password === "default123") {
        return res.status(200).json({
          message: "First login. Please update your password.",
          firstLogin: true,
          userID: user.userID
        });
      }

      // Success response if login is successful
      res.status(200).json({
        message: "Login successful",
        user: {
          userID: user.userID,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  },

  // Controller method to update the password
  updatePassword: async (req, res) => {
    const { userID, newPassword } = req.body;

    if (!userID || !newPassword) {
      return res.status(400).json({ message: "UserID and new password are required" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    LoginModel.updatePassword(userID, hashedPassword, (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Password updated successfully" });
    });
  }
};

module.exports = LoginController;
