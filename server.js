require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const systemAdminRouter = require('./routes/systemAdminRouter');
const inventoryRouter = require('./routes/inventoryRouter');
const loginRoutes = require('./routes/loginRoutes');
const purchaseRequestRoutes = require("./routes/purchaseRequestRoutes");
const orderRoutes = require("./routes/orderRoutes");  // Import the new order routes
const messageRouts = require("./routes/messageRoutes");

const app = express();

// CORS configuration to allow only specific IPs
app.use(cors());

app.use(express.json());

// Register routers
app.use('/admin', systemAdminRouter);
app.use('/api', inventoryRouter);
app.use("/api", loginRoutes);
app.use("/api", purchaseRequestRoutes);
app.use("/api", orderRoutes);  // Register the order routes

app.use('/api/roles', systemAdminRouter);
app.use('/api',messageRouts);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
