const express = require('express');
const { send_message, all_chats_messages } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/send-message', auth, send_message);
router.post('/all-chat-messages', auth, all_chats_messages);

module.exports = router;
