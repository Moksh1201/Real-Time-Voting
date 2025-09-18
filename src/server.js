import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initSockets } from "./sockets.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

initSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
