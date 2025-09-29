const fs = require("fs");
const path = require("path");
const { handleLanding } = require("../phases/landing");
const { handlegate } = require("../phases/gatedock");
const { handleTaxiwayIn, handleTaxiwayOut } = require("../phases/taxiway");
const { handleTakeoff } = require("../phases/takeOff");


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleFlight(flight, socket,flightDB) {
  const landingInfo =await handleLanding(flight, socket);
  const taxiwayIn=await handleTaxiwayIn(flight,socket);
  const gateInfo=await handlegate(flight,socket);
  const taxiwayout=await handleTaxiwayOut(flight,socket);
  const departure=await handleTakeoff(flight,socket);

  const flightRecord = {
    flightId: flight.id,
    ...landingInfo,
    ...taxiwayIn,
    ...gateInfo,
    ...taxiwayout,
    ...departure
  };

  flightDB.push(flightRecord);
}
async function simulateFlights(queue, socket,flightDB) {
    const flightPromises = queue.map(flight => handleFlight(flight, socket, flightDB));
    
    await Promise.all(flightPromises);
}
function saveSummary(flightDB) {
  const summaryFile = path.join(__dirname, "../data/summary.json");
  let summaries = [];

  if (fs.existsSync(summaryFile)) {
    summaries = JSON.parse(fs.readFileSync(summaryFile, "utf-8"));
  }

  const summaryId = summaries.length + 1;
  summaries.push({ summaryId, flights: flightDB });

  fs.writeFileSync(summaryFile, JSON.stringify(summaries, null, 2));

  console.log(`Summary ${summaryId} saved to summary.json`);
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    const flights = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/flights.json"))
    );
    let flightDB = [];
    (async () => {
      await simulateFlights(flights, socket, flightDB);
      saveSummary(flightDB);
    })();

    socket.on("disconnect", () => {
      console.log("Frontend disconnected:", socket.id);
    });
  });
};
