const express = require('express');
const SystemAdminController = require('../controllers/systemAdminController');
const { authMiddleware } = require('../controllers/LoginController'); // Assuming you export this from LoginController

const router = express.Router();

// Protect routes with authMiddleware
router.get('/', authMiddleware, SystemAdminController.getAll); // Admin only
router.put('/:id', authMiddleware, SystemAdminController.update); // Admin only
router.delete('/:id', authMiddleware, SystemAdminController.delete); // Admin only
router.get('/dashboard', authMiddleware, SystemAdminController.getDashboardStats); // Anyone with valid token
router.post('/create', authMiddleware, SystemAdminController.createAdminUser); // Admin only

module.exports = router;
