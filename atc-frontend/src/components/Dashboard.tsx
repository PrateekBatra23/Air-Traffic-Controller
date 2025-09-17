import type { Flight } from "../types";
import styles from "./Dashboard.module.css";

interface Props {
  flights: Flight[];
}

function Dashboard({ flights }: Props) {
  return (
    <section className={styles.dashboard}>
      <h2>Flight Dashboard</h2>
      <div className={styles.grid}>
        {flights.length === 0 ? (
          <p>No flights available</p>
        ) : (
          flights.map((f, i) => (
            <div key={i} className={styles.card}>
              <h3>{f.flightId}</h3>
              <p><strong>Airline:</strong> {f.airline}</p>
              <p><strong>Status:</strong> {f.status}</p>
              <p><strong>Priority:</strong> {f.priority}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Dashboard;
