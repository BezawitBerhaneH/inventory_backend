const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get("/", controllers.getSystemAdmins);
router.post("/inventory", controllers.addInventoryItem);
router.get("/inventory", controllers.getInventory);
router.put("/inventory/threshold/:id", controllers.updateThreshold);
router.put("/admin/:id", controllers.updateSystemAdmin);
router.delete("/admin/:id", controllers.deleteSystemAdmin);
router.get("/dashboard", controllers.getDashboardStats);

module.exports = router;
