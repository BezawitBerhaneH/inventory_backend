const { Router } = require('express');
const MessageController = require('../controllers/MessageController');
const { authMiddleware } = require('../controllers/LoginController');

const router = Router();

// Send a message
router.post('/send', authMiddleware, MessageController.sendMessage);

// Retrieve messages for the logged-in user
router.get('/messages', authMiddleware, MessageController.getMessages);

module.exports = router;
