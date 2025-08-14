import React from "react";
import styles from "./Success.module.css";

const Success = ({ children }) => {
  return (
    <div className={styles.successBox}>
      <p className={styles.successMessage}>{children}</p>
    </div>
  );
};

export default Success;
