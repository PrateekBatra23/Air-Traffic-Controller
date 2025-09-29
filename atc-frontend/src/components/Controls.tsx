import { useState } from "react";
import { startSim, stopSim } from "../services/api";
import type { LogEvent } from "../types";
import styles from "./Controls.module.css";
import io, { Socket } from "socket.io-client";

interface Props {
  setLogs: React.Dispatch<React.SetStateAction<LogEvent[]>>;
  onStart?: () => void;
  onStop?: () => void;
  onSimulationComplete?: () => void; // New prop
}

let socket: Socket | null = null;

function Controls({ setLogs, onStart, onStop, onSimulationComplete }: Props) {
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = async () => {
    if (!socket) {
      socket = io("http://localhost:5000");
      
      socket.on("connect", async () => {
        console.log("Connected with socket ID:", socket!.id);
        setLogs((prev) => [...prev, { 
          event: "Connected to server", 
          timestamp: new Date().toISOString() 
        }]);

        try {
          await startSim(socket!.id!);
          setLogs((prev) => [...prev, { 
            event: "Simulation Started", 
            timestamp: new Date().toISOString() 
          }]);
          setIsRunning(true);
          onStart?.();
        } catch (error) {
          console.error("Failed to start simulation:", error);
          setLogs((prev) => [...prev, { 
            event: "Failed to start simulation", 
            timestamp: new Date().toISOString() 
          }]);
        }
      });

      // Listen to simulation events
      socket.on("simulationComplete", (data) => {
        console.log("Simulation complete:", data);
        setLogs((prev) => [...prev, { 
          event: "Simulation completed successfully", 
          timestamp: new Date().toISOString() 
        }]);
        setIsRunning(false);
        onSimulationComplete?.(); // Notify parent to reload summary
      });

      socket.on("simulationStopped", (data) => {
        console.log("Simulation stopped:", data);
        setLogs((prev) => [...prev, { 
          event: "Simulation stopped", 
          timestamp: new Date().toISOString() 
        }]);
        setIsRunning(false);
      });

      socket.on("simulationError", (data) => {
        console.error("Simulation error:", data);
        setLogs((prev) => [...prev, { 
          event: `Simulation error: ${data.error}`, 
          timestamp: new Date().toISOString() 
        }]);
        setIsRunning(false);
      });

      // Listen to all flight events
      socket.on("clearedForLanding", (data) => {
        console.log("clearedForLanding:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} cleared for landing`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("Touchdown", (data) => {
        console.log("Touchdown:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} touchdown on ${data.runway}`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("enteredTaxiwayIn", (data) => {
        console.log("enteredTaxiwayIn:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} entered taxiway (inbound)`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("gateAssigned", (data) => {
        console.log("gateAssigned:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} docked at ${data.gate}`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("gateReleased", (data) => {
        console.log("gateReleased:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} left ${data.gate}`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("enteredTaxiwayOut", (data) => {
        console.log("enteredTaxiwayOut:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} entered taxiway (outbound)`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("clearedForTakeoff", (data) => {
        console.log("clearedForTakeoff:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} cleared for takeoff on ${data.runway}`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("takeoffroll", (data) => {
        console.log("takeoffroll:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} takeoff roll on ${data.runway}`, 
          timestamp: data.timestamp 
        }]);
      });

      socket.on("flightDeparted", (data) => {
        console.log("flightDeparted:", data);
        setLogs((prev) => [...prev, { 
          event: `${data.flightId} departed`, 
          timestamp: data.timestamp 
        }]);
      });
    }
  };

  const handleStop = async () => {
    if (socket && socket.id) {
      try {
        await stopSim(socket.id);
        setLogs((prev) => [...prev, { 
          event: "Stop signal sent to server", 
          timestamp: new Date().toISOString() 
        }]);
      } catch (error) {
        console.error("Failed to stop simulation:", error);
        setLogs((prev) => [...prev, { 
          event: "Failed to stop simulation", 
          timestamp: new Date().toISOString() 
        }]);
      }
      
      socket.disconnect();
      socket = null;
    }
    
    setIsRunning(false);
    onStop?.();
  };

  return (
    <section className={styles.controls}>
      <h3 className={styles.controlsTitle}>Simulation Controls</h3>
      <button 
        onClick={handleStart} 
        className={styles.startBtn}
        disabled={isRunning}
      >
        Start Simulation
      </button>
      <button 
        onClick={handleStop} 
        className={styles.stopBtn}
        disabled={!isRunning}
      >
        Stop Simulation
      </button>
      <div className={`${styles.statusIndicator} ${isRunning ? styles.running : styles.stopped}`}>
        <span className={`${styles.statusDot} ${isRunning ? styles.running : styles.stopped}`}></span>
        {isRunning ? "Running" : "Stopped"}
      </div>
    </section>
  );
}

export default Controls;