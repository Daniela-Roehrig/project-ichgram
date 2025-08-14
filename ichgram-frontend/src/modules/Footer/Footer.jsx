import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer({
  onCreateClick,
  onSearchClick,
  onMessagesClick,
}) {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link to="/home">Home</Link>
        <span className={styles.clickable} onClick={onSearchClick}>Search</span>
        <Link to="/explore">Explore</Link>
        <span className={styles.clickable} onClick={onMessagesClick}>Messages</span>
        <Link to="/notifications">Notifications</Link>
        <span className={styles.clickable} onClick={onCreateClick}>Create</span>
      </nav>
      <p className={styles.copyright}>© 2025 ICHgram</p>
    </footer>
  );
}
