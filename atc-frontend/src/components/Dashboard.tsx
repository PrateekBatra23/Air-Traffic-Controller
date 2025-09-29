import type { Flight } from "../types";
import styles from "./Dashboard.module.css";

interface Props {
  flights: Flight[];
}

function Dashboard({ flights }: Props) {
  return (
    <section className={styles.dashboard}>
      <div className={styles.panel}>
        <h2 className={styles.title}>Flight Dashboard</h2>

        {flights.length === 0 ? (
          <div className={styles.empty}>
            <p>No flights available</p>
            <p className={styles.hint}>Use the form to add a flight</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {flights.map((f, i) => {
              const priorityKey = `priority-${String(f.priority || "normal").toLowerCase()}`;
              const scheduledTime = f.scheduledLanding 
                ? new Date(f.scheduledLanding).toLocaleString()
                : "Not scheduled";

              return (
                <article key={i} className={styles.card}>
                  <div className={styles.cardHead}>
                    <h3 className={styles.flightId}>{f.flightId}</h3>
                    <span className={`${styles.badge} ${styles[priorityKey]}`}>{f.priority}</span>
                  </div>
                  <div className={styles.meta}>
                    <div className={styles.row}>
                      <span className={styles.label}>Airline</span>
                      <span className={styles.value}>{f.airline}</span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.label}>Scheduled</span>
                      <span className={styles.value}>{scheduledTime}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;