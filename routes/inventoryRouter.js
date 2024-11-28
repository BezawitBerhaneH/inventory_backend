const express = require('express');
const InventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', InventoryController.getAll);
router.post('/', InventoryController.add);
router.put('/threshold/:id', InventoryController.updateThreshold);

module.exports = router;
