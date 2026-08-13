const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

function initChatSocket(io) {
  // authenticate socket connections with the same JWT used for REST
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId); // personal room = own userId
    io.emit("presence:online", { userId: socket.userId });

    socket.on("chat:send", async ({ receiverId, text }) => {
      if (!text?.trim()) return;
      const message = await Message.create({
        senderId: socket.userId,
        receiverId,
        text: text.trim(),
      });
      io.to(receiverId).emit("chat:receive", message);
      io.to(socket.userId).emit("chat:receive", message); // echo to sender's other tabs
    });

    socket.on("chat:typing", ({ receiverId }) => {
      io.to(receiverId).emit("chat:typing", { from: socket.userId });
    });

    socket.on("disconnect", () => {
      io.emit("presence:offline", { userId: socket.userId });
    });
  });
}

module.exports = initChatSocket;
