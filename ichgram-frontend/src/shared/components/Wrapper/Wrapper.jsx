import styles from "./Wrapper.module.css";

const Wrapper = ({ children }) => {
  return <section className={styles.wrapper}>{children}</section>;
};

export default Wrapper;
