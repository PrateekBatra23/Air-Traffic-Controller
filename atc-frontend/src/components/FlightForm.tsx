import { useState } from "react";
import { addFlight } from "../services/api";
import type { Flight } from "../types";
import styles from "./FlightForm.module.css";

function FlightForm() {
  const [flight, setFlight] = useState<Partial<Flight>>({
    flightId: "",
    airline: "",
    arrivalTime: "",
    priority: "normal",
    status: "scheduled",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFlight({ ...flight, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (flight.flightId && flight.airline && flight.arrivalTime) {
      await addFlight(flight as Flight);
      alert("Flight added successfully!");
      setFlight({ flightId: "", airline: "", arrivalTime: "", priority: "normal", status: "scheduled" });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" name="flightId" value={flight.flightId} placeholder="Flight ID" onChange={handleChange} required />
      <input type="text" name="airline" value={flight.airline} placeholder="Airline" onChange={handleChange} required />
      <input type="datetime-local" name="arrivalTime" value={flight.arrivalTime} onChange={handleChange} required />
      <select name="priority" value={flight.priority} onChange={handleChange}>
        <option value="normal">Normal</option>
        <option value="vip">VIP</option>
        <option value="emergency">Emergency</option>
      </select>
      <button type="submit">Add Flight</button>
    </form>
  );
}

export default FlightForm;
