
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
  const assignedTime = new Date().toISOString();


  socket.emit("gateAssigned", {
    flightId: flight.flightId,
    gate: `G-${gateIndex + 1}`,
    status: "docked",
    timestamp: assignedTime,
  });

  await sleep(10000);

  gates[gateIndex] = false;
  const releasedTime = new Date().toISOString();
  socket.emit("gateReleased", {
    flightId: flight.flightId,
    gate: `G-${gateIndex + 1}`,
    timestamp: releasedTime,
  });
  return {
    gateNo: `G-${gateIndex + 1}`,
    gateAssignedTime: assignedTime,
    gateReleasedTime: releasedTime,
  };
}

module.exports={handlegate}