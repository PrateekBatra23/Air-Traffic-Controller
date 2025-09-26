import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <h1 className={styles.brand}>ATC Simulation</h1>
      </div>
    </nav>
  );
}

export default Navbar;
