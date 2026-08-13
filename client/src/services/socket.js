import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token) {
  if (socket) return socket;
  // Falls back to same-origin (dev proxy / nginx). In production, set
  // VITE_SOCKET_URL to your deployed backend, e.g. https://hirehub-server.onrender.com
  const url = import.meta.env.VITE_SOCKET_URL || "/";
  socket = io(url, { auth: { token }, autoConnect: true });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
