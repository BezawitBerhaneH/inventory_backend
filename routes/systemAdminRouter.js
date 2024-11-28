const express = require('express');
const SystemAdminController = require('../controllers/systemAdminController');

const router = express.Router();

router.get('/', SystemAdminController.getAll);
router.put('/:id', SystemAdminController.update);
router.delete('/:id', SystemAdminController.delete);
router.get('/dashboard', SystemAdminController.getDashboardStats);
router.post('/create', SystemAdminController.createAdminUser);

module.exports = router;
