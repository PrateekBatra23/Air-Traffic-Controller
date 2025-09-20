const fs = require("fs");
const path = require("path");
const { handleLanding } = require("../phases/landing");
const { handleTaxiway } = require("../phases/taxiway");
const { handlegate } = require("../phases/gatedock");


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleFlight(flight, socket) {
  await handleLanding(flight, socket);
  await handleTaxiway(flight,socket);
  await handlegate(flight,socket);
}
async function simulateFlights(queue, socket) {
    for (const flight of queue) {
        handleFlight(flight, socket);
        sleep(500)
    }
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    const flights = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/flights.json"))
    );

    simulateFlights(flights, socket);

    socket.on("disconnect", () => {
      console.log("Frontend disconnected:", socket.id);
    });
  });
};
