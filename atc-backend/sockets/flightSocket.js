const fs = require("fs");
const path = require("path");


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let runwayBusyUntil = Date.now();

const approachTime = 3000; 
const landingTime = 2000;  

async function handleFlight(flight, socket) {
  
  while(runwayBusyUntil> Date.now() + approachTime) {
    await sleep(runwayBusyUntil-Date.now())
  } 
  const currentTime = Date.now();
  runwayBusyUntil=currentTime+approachTime+landingTime;
      
    socket.emit("clearedForLanding", {
      flightId: flight.flightId,
      timestamp: new Date().toISOString()
    });
    
    await sleep(approachTime);
    
    socket.emit("Touchdown",{
      flightId: flight.flightId,
      runway:"RW-1",
      status:"Touchdown Complete",
      timestamp:new Date().toISOString()
    });
  
    await sleep(landingTime);
    
    socket.emit("enteredTaxiway", {
      flightId: flight.flightId,
      runway: "RW-1",
      status: "landed → taxiway",
      timestamp: new Date().toISOString()
    });
    await sleep(500);

}

async function simulateFlights(queue, socket) {
    for (const flight of queue) {
        handleFlight(flight, socket); 
        await sleep(500); 
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
