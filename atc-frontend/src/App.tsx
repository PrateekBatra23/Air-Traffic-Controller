import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Logs from "./components/Logs";
import FlightForm from "./components/Flightform";
import Controls from "./components/Controls";
import type { Flight, LogEvent } from "./types";
import "./App.css";

const socket: Socket = io("http://localhost:5000");

function App() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    socket.on("simulationStarted", (msg: LogEvent) =>
      setLogs((l) => [...l, msg])
    );
    socket.on("flightAdded", (data: Flight) =>
      setFlights((f) => [...f, data])
    );
    socket.on("flightDeparted", (msg: LogEvent) =>
      setLogs((l) => [...l, msg])
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Controls setLogs={setLogs} />
        <FlightForm />
        <Dashboard flights={flights} />
        <Logs logs={logs} />
      </main>
    </div>
  );
}

export default App;
