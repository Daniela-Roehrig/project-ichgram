import { Link } from "react-router-dom";
import styles from "./AuthLink.module.css";

const AuthLink = ({ textLink, toLink }) => {
  return (
    <Link to={toLink} className={styles.link}>
      {textLink}
    </Link>
  );
};

export default AuthLink;
