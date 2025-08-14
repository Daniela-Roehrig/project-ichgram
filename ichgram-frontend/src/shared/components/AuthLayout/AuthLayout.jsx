import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default AuthLayout;
