

async function handleTaxiway(flight,socket){
    socket.emit("enteredTaxiway", {
      flightId: flight.flightId,
      runway: "RW-1",
      status: "landed → taxiway",
      timestamp: new Date().toISOString()
    });
}
module.exports={handleTaxiway}