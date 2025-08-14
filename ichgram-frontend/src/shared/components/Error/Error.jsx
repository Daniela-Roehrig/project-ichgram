import styles from "./Error.module.css";

const Error = ({ children }) => {
  return (
    <div className={styles.errorBox}>
      <p className={styles.error}>{children}</p>
    </div>
  );
};

export default Error;
