

async function handleTaxiwayIn(flight,socket){
    const timestamp = new Date().toISOString();
    socket.emit("enteredTaxiwayIn", {
      flightId: flight.flightId,
      runway: "",
      status: "landed -> taxiway",
      timestamp
    });
    return {
    taxiwayIn: "Taxiway-1",
    taxiwayInTime: timestamp,
  };
}
async function handleTaxiwayOut(flight,socket){
    const timestamp = new Date().toISOString();
    socket.emit("enteredTaxiwayOut", {
      flightId: flight.flightId,
      runway: "",
      status: "gate -> taxiway",
      timestamp
    });
    return {
    taxiwayOut: "Taxiway-2",
    taxiwayOutTime: timestamp,
  };
}

module.exports={handleTaxiwayIn,handleTaxiwayOut}
