require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const initChatSocket = require("./sockets/chatSocket");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "*", credentials: true },
  });

  initChatSocket(io);

  server.listen(PORT, () => {
    console.log(`HireHub server running on http://localhost:${PORT}`);
  });
});
