function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let runwayBusyUntil = Date.now();

const approachTime = 3000; 
const landingTime = 2000;  

async function handleLanding(flight, socket) {
  
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
    
    
    await sleep(500);

}
module.exports = { handleLanding };