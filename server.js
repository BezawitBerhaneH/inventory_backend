require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const systemAdminRouter = require('./routes/systemAdminRouter');
const inventoryRouter = require('./routes/inventoryRouter');
const loginRoutes = require('./routes/loginRoutes');
const purchaseRequestRoutes = require("./routes/purchaseRequestRoutes");
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();

// CORS configuration to allow only specific IPs
const allowedIps = ['192.168.19.199', '192.168.1.100']; // Replace with your allowed IPs
app.use(cors({
  origin: (origin, callback) => {
    if (allowedIps.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  }
}));

app.use(express.json());

// Register routers
app.use('/admin', systemAdminRouter);
app.use('/inventory', inventoryRouter);
app.use("/api", loginRoutes);
app.use("/api", purchaseRequestRoutes);
app.use("/api/notifications", notificationRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, '192.168.19.199', () => {
  console.log(`Server is running on port ${PORT}`);
});
