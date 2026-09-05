const router = require('express').Router();
const { getChats, createChat, getMessages, sendMessage } = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getChats);
router.post('/', auth, createChat);
router.get('/:chatId/messages', auth, getMessages);
router.post('/:chatId/messages', auth, sendMessage);

module.exports = router;
