import type { LogEvent } from "../types";
import styles from "./Logs.module.css";

interface Props {
  logs: LogEvent[];
}

function Logs({ logs }: Props) {
  return (
    <section className={styles.logs}>
      <h2>Event Logs</h2>
      <ul>
        {logs.length === 0 ? (
          <li>No events yet</li>
        ) : (
          logs.map((log, i) => (
            <li key={i}>
              <strong>{log.event}</strong> — {log.timestamp}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default Logs;
