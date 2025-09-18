const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const flightSocket = require("./sockets/flightSocket");

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

flightSocket(io);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
