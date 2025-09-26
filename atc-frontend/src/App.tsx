import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Logs from "./components/Logs";
import FlightForm from "./components/FlightForm";
import Controls from "./components/Controls";
import Summary from "./components/Summary";
import type { Flight, LogEvent, FlightSummary } from "./types";
import "./App.css";

const socket: Socket = io("http://localhost:5000");

function App() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [summaryData, setSummaryData] = useState<FlightSummary[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  useEffect(() => {
    socket.on("simulationStarted", (msg: LogEvent) => {
      setLogs((l) => [...l, msg]);
      setIsSimulationRunning(true);
    });

    socket.on("simulationStopped", (msg: LogEvent) => {
      setLogs((l) => [...l, msg]);
      setIsSimulationRunning(false);
    });

    socket.on("flightAdded", (data: Flight) => {
      setFlights((f) => [...f, data]);
    });

    socket.on("flightDeparted", (msg: LogEvent) => {
      setLogs((l) => [...l, msg]);
    });

    // Listen for turnaround updates from backend
    socket.on("turnaroundUpdate", (data: FlightSummary) => {
      setSummaryData((prev) => {
        const existingIndex = prev.findIndex(
          (f) => f.flightId === data.flightId
        );
        if (existingIndex >= 0) {
          // Update existing flight
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        } else {
          // Add new flight
          return [...prev, data];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fallback: Generate summary data from current flights if backend doesn't send it
  useEffect(() => {
    if (isSimulationRunning && flights.length > 0) {
      const newSummary = flights.map((flight) => {
        const arrivalDate = new Date(flight.arrivalTime);
        const existingSummary = summaryData.find(
          (s) => s.flightId === flight.flightId
        );

        // If we already have data for this flight, keep it
        if (existingSummary) {
          return existingSummary;
        }

        // Otherwise create new summary entry
        return {
          flightId: flight.flightId,
          date: arrivalDate.toLocaleDateString(),
          airline: flight.airline,
          touchdownTime:
            flight.status === "landing" ||
            flight.status === "taxiing" ||
            flight.status === "docked" ||
            flight.status === "departed"
              ? arrivalDate.toLocaleTimeString()
              : "",
          taxiwayInTime:
            flight.status === "taxiing" ||
            flight.status === "docked" ||
            flight.status === "departed"
              ? new Date(arrivalDate.getTime() + 2 * 60000).toLocaleTimeString()
              : "",
          gateDockTime:
            flight.status === "docked" || flight.status === "departed"
              ? new Date(arrivalDate.getTime() + 7 * 60000).toLocaleTimeString()
              : "",
          gateAllotted:
            flight.status === "docked" || flight.status === "departed"
              ? `Gate ${Math.floor(Math.random() * 20) + 1}`
              : "",
          gateUndockTime:
            flight.status === "departed"
              ? new Date(
                  arrivalDate.getTime() + 45 * 60000
                ).toLocaleTimeString()
              : "",
          taxiwayOutTime:
            flight.status === "departed"
              ? new Date(
                  arrivalDate.getTime() + 47 * 60000
                ).toLocaleTimeString()
              : "",
          clearanceTime:
            flight.status === "departed"
              ? new Date(
                  arrivalDate.getTime() + 52 * 60000
                ).toLocaleTimeString()
              : "",
          takeoffTime:
            flight.status === "departed"
              ? new Date(
                  arrivalDate.getTime() + 55 * 60000
                ).toLocaleTimeString()
              : "",
          totalTurnaroundTime:
            flight.status === "departed" ? "55 mins" : "In Progress",
        };
      });

      setSummaryData(newSummary);
    }
  }, [flights, isSimulationRunning]);

  const handleSimulationStart = () => {
    setIsSimulationRunning(true);
  };

  const handleSimulationStop = () => {
    setIsSimulationRunning(false);
    // Summary data persists after simulation stops
  };

  return (
    <div className="app">
      <Navbar />
      <main>
        <Controls
          setLogs={setLogs}
          onStart={handleSimulationStart}
          onStop={handleSimulationStop}
        />
        <FlightForm />
        <Dashboard flights={flights} />
        <Summary summaryData={summaryData} />
        <Logs logs={logs} />
      </main>
    </div>
  );
}

export default App;