import { startSim, stopSim } from "../services/api";
import type { LogEvent } from "../types";
import styles from "./Controls.module.css";

interface Props {
  setLogs: React.Dispatch<React.SetStateAction<LogEvent[]>>;
  onStart?: () => void;
  onStop?: () => void;
}

function Controls({ setLogs, onStart, onStop }: Props) {
  const handleStart = async () => {
    await startSim();
    setLogs((prev) => [...prev, { event: "Simulation Started", timestamp: new Date().toISOString() }]);
    onStart?.();
  };

  const handleStop = async () => {
    await stopSim();
    setLogs((prev) => [...prev, { event: "Simulation Stopped", timestamp: new Date().toISOString() }]);
    onStop?.();
  };

  return (
    <section className={styles.controls}>
      <button onClick={handleStart} className={styles.startBtn}>Start Simulation</button>
      <button onClick={handleStop} className={styles.stopBtn}>Stop Simulation</button>
    </section>
  );
}

export default Controls;