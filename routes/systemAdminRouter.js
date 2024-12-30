const express = require('express');
const SystemAdminController = require('../controllers/systemAdminController');
const { authMiddleware } = require('../controllers/LoginController'); // Assuming you export this from LoginController

const router = express.Router();

// Protect routes with authMiddleware

// System Admin Routes
router.get('/users', authMiddleware, SystemAdminController.getAll); // Admin only
router.put('/:id', authMiddleware, SystemAdminController.update); // Admin only
router.delete('/:id', authMiddleware, SystemAdminController.delete); // Admin only
router.get('/dashboard', authMiddleware, SystemAdminController.getDashboardStats); // Anyone with valid token
router.post('/create', authMiddleware, SystemAdminController.createAdminUser); // Admin only
router.patch('/deactivate/:id', authMiddleware, SystemAdminController.deactivate); // Admin only

// Role Management Routes
router.get('/allroles', authMiddleware, SystemAdminController.getAllRoles); // Admin only
router.post('/createrole', authMiddleware, SystemAdminController.createRole); // Admin only
router.put('/role/:id', authMiddleware, SystemAdminController.updateRole); // Admin only


// Supplier Routes
router.get('/suppliers', authMiddleware, SystemAdminController.getAllSuppliers); // Admin only
router.post('/supplier', authMiddleware, SystemAdminController.createSupplier); // Admin only
router.put('/supplier/:id', authMiddleware, SystemAdminController.updateSupplier); // Admin only
router.delete('/supplier/:id', authMiddleware, SystemAdminController.deleteSupplier); // Admin only

module.exports = router;
