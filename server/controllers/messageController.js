const Message = require("../models/Message");

const getConversation = async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: req.user.id, receiverId: userId },
      { senderId: userId, receiverId: req.user.id },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
};

module.exports = { getConversation };
