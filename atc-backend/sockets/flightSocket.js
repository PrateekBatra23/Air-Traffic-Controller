const fs = require("fs");
const path = require("path");


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function simulateFlight(socket, flight) {
  const flightId = flight.flightId;

  await sleep(2000);
  socket.emit("flightLanded", {
    flightId,
    runway: "RW-1",
    status: "landed",
    timestamp: new Date().toISOString()
  });

  await sleep(2000);
  socket.emit("taxiwayInStart", {
    flightId,
    from: "RW-1",
    to: "G-5",
    timestamp: new Date().toISOString()
  });

  await sleep(2000);
  socket.emit("gateAssigned", {
    flightId,
    gate: "G-5",
    status: "docked",
    timestamp: new Date().toISOString()
  });


  await sleep(3000);
  socket.emit("gateReleased", {
    flightId,
    gate: "G-5",
    timestamp: new Date().toISOString()
  });

  socket.emit("taxiwayOutStart", {
    flightId,
    from: "G-5",
    to: "RW-1",
    timestamp: new Date().toISOString()
  });

  await sleep(2000);
  socket.emit("flightDeparted", {
    flightId,
    runway: "RW-1",
    status: "departed",
    timestamp: new Date().toISOString()
  });
}


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    const flights = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/flights.json"))
    );

    flights.forEach((flight, index) => {
      setTimeout(() => {
        simulateFlight(socket, flight);
      }, index * 5000);
    });

    socket.on("disconnect", () => {
      console.log("Frontend disconnected:", socket.id);
    });
  });
};
