const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const flightSocket = require("../sockets/flightHandler");

module.exports = (io) => {
  router.post("/start", async (req, res) => {
    const { socketId } = req.body;
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      return res.status(404).json({ error: "Socket not found or not connected" });
    }
    console.log(`Starting simulation for socket ${socketId}`);
    const flights = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/flights.json")));
    
    let flightDB = [];
    await flightSocket.simulateFlights(flights, socket, flightDB);
    flightSocket.saveSummary(flightDB);

    res.json({ message: `Flight simulation started for ${socketId}` });
  });

  return router;
};