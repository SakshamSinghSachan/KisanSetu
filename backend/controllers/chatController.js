const { Chat, Message } = require('../models/Chat');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name avatar role')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] }
    });
    if (existingChat) return res.json(existingChat);
    const chat = new Chat({ participants: [req.user._id, participantId] });
    await chat.save();
    await chat.populate('participants', 'name avatar role');
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    const message = new Message({
      chat: req.params.chatId,
      sender: req.user._id,
      content,
      type
    });
    await message.save();
    await message.populate('sender', 'name avatar');
    await Chat.findByIdAndUpdate(req.params.chatId, { lastMessage: message._id, updatedAt: Date.now() });
    if (req.io) {
      req.io.to(req.params.chatId).emit('newMessage', message);
    }
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
