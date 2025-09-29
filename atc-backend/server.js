const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const flightSocket = require("./sockets/flightHandler");
const fs = require("fs");
const path = require("path");


const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

flightSocket(io);

app.post("/api/start-flights", async(req, res) => {
  const { socketId } = req.body;

  const socket = io.sockets.sockets.get(socketId);
  if (!socket) {
    return res.status(404).json({ error: "Socket not found or not connected" });
  }

  console.log(`Starting simulation for socket ${socketId}`);

  const flights = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./data/flights.json"))
  );
  let flightDB = [];

  await flightSocket.simulateFlights(flights, socket, flightDB);
  flightSocket.saveSummary(flightDB);

  res.json({ message: `Flight simulation started for ${socketId}` });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
