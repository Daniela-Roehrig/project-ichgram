import { Link } from "react-router-dom";
import styles from "./AuthFooter.module.css";

const AuthFooter = ({ text, linkText, toLink }) => {
  return (
    <div className={styles.authFooterContainer}>
      <p className={styles.text}>{text}</p>
      <Link to={toLink} className={styles.link}>
        {linkText}
      </Link>
    </div>
  );
};

export default AuthFooter;
