import 'dotenv/config';
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initSockets } from "./sockets.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
// Initialize WebSocket connections which helps in real-time communication with clients 
initSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
