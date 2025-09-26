import type { LogEvent } from "../types";
import styles from "./Logs.module.css";

interface Props {
  logs: LogEvent[];
}

function Logs({ logs }: Props) {
  return (
    <section className={styles.logs}>
      <h2 className={styles.title}>Event Logs</h2>

      <div className={styles.panel}>

      {logs.length === 0 ? (
        <div className={styles.empty}>No events yet</div>
      ) : (
        <ul className={styles.list}>
          {logs.map((log, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.event}>{log.event}</span>
              <span className={styles.time}>{log.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
      </div>
    </section>
  );
}

export default Logs;
