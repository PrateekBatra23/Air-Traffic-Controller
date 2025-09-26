import type { FlightSummary } from "../types";
import styles from "./Summary.module.css";

interface Props {
  summaryData: FlightSummary[];
}

function Summary({ summaryData }: Props) {
  return (
    <section className={styles.summary}>
      <h2 className={styles.heading}>Flight Turnaround Summary</h2>

      {summaryData.length === 0 ? (
        <p className={styles.noData}>No summary data available. Start a simulation to see results.</p>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.th}>Flight No.</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Airline</th>
                  <th className={styles.th}>Touchdown</th>
                  <th className={styles.th}>Taxiway In</th>
                  <th className={styles.th}>Gate Dock</th>
                  <th className={styles.th}>Gate Allotted</th>
                  <th className={styles.th}>Gate Undock</th>
                  <th className={styles.th}>Taxiway Out</th>
                  <th className={styles.th}>Cleared for Takeoff</th>
                  <th className={styles.th}>Takeoff</th>
                  <th className={styles.th}>Total Turnaround</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((flight, index) => (
                  <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    <td className={styles.td}>{flight.flightId}</td>
                    <td className={styles.td}>{flight.date}</td>
                    <td className={styles.td}>{flight.airline}</td>
                    <td className={styles.td}>{flight.touchdownTime || "-"}</td>
                    <td className={styles.td}>{flight.taxiwayInTime || "-"}</td>
                    <td className={styles.td}>{flight.gateDockTime || "-"}</td>
                    <td className={styles.td}>{flight.gateAllotted || "-"}</td>
                    <td className={styles.td}>{flight.gateUndockTime || "-"}</td>
                    <td className={styles.td}>{flight.taxiwayOutTime || "-"}</td>
                    <td className={styles.td}>{flight.clearanceTime || "-"}</td>
                    <td className={styles.td}>{flight.takeoffTime || "-"}</td>
                    <td className={styles.tdHighlight}>{flight.totalTurnaroundTime || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.stats}>
            <p className={styles.statsText}><strong>Total Flights Processed</strong>: {summaryData.length}</p>
            <p className={styles.statsText}><strong>Last Updated</strong>: {new Date().toLocaleString()}</p>
          </div>
        </>
      )}
    </section>
  );
}

export default Summary;
