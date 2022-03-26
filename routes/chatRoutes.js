const express = require('express');
const { send_message } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/send-message', auth, send_message);

module.exports = router;
