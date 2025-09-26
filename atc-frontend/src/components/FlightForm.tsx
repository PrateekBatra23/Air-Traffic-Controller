import { useState } from "react";
import { addFlight } from "../services/api";
import type { Flight } from "../types";
import styles from "./FlightForm.module.css";

function FlightForm() {
  const [flight, setFlight] = useState<Partial<Flight>>({
    flightId: "",
    airline: "",
    arrivalTime: "",
    priority: "normal" as any,
    status: "scheduled" as any,
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlight((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!flight.flightId) errs.flightId = "Flight ID is required";
    if (!flight.airline) errs.airline = "Airline is required";
    if (!flight.arrivalTime) errs.arrivalTime = "Arrival time is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      await addFlight(flight as Flight);
      alert("Flight added successfully!");
      setFlight({
        flightId: "",
        airline: "",
        arrivalTime: "",
        priority: "normal" as any,
        status: "scheduled" as any,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="flightId">Flight ID</label>
        <input
          id="flightId"
          name="flightId"
          type="text"
          value={flight.flightId || ""}
          onChange={handleChange}
          placeholder="e.g. AI-302"
          required
          aria-invalid={!!errors.flightId}
        />
        {errors.flightId && <p className={styles.error}>{errors.flightId}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="airline">Airline</label>
        <input
          id="airline"
          name="airline"
          type="text"
          value={flight.airline || ""}
          onChange={handleChange}
          placeholder="e.g. Air India"
          required
          aria-invalid={!!errors.airline}
        />
        {errors.airline && <p className={styles.error}>{errors.airline}</p>}
      </div>

  <div className={styles.field}>
  <label htmlFor="arrivalTime">Arrival time</label>
  <input
    id="arrivalTime"
    name="arrivalTime"
    type="datetime-local"
    className={styles.datetime}
    placeholder="Select arrival time"
    value={flight.arrivalTime || ""}
    onChange={handleChange}
    required
    aria-invalid={!!errors.arrivalTime}
  />
  {errors.arrivalTime && <p className={styles.error}>{errors.arrivalTime}</p>}
</div>

      <div className={styles.field}>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={(flight.priority as string) || "normal"}
          onChange={handleChange}
        >
          <option value="normal">Normal</option>
          <option value="vip">VIP</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Flight"}
        </button>
      </div>
    </form>
  );
}

export default FlightForm;
