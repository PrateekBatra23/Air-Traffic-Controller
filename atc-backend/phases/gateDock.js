const { Socket } = require("socket.io")
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const NUM_GATES = 3;
const gates = Array(NUM_GATES).fill(false);

async function handlegate(flight, socket) {
  let gateIndex = -1;

  while (gateIndex === -1) {
    gateIndex = gates.findIndex((g) => g === false);
    if (gateIndex === -1) {
      await sleep(1000);
    }
  }

  gates[gateIndex] = true;

  socket.emit("gateAssigned", {
    flightId: flight.flightId,
    gate: `G-${gateIndex + 1}`,
    status: "docked",
    timestamp: new Date().toISOString(),
  });

  await sleep(10000);

  gates[gateIndex] = false;

  socket.emit("gateReleased", {
    flightId: flight.flightId,
    gate: `G-${gateIndex + 1}`,
    timestamp: new Date().toISOString(),
  });
}

module.exports={handlegate}