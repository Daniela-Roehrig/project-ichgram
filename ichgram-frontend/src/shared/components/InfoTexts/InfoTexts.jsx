import styles from "./InfoTexts.module.css";

const InfoText = () => {
 
  return (
    <div className={styles.container}>
      <p className={styles.pBox}>
        People who use our service may have uploaded your contact information to Instagram.{" "}
        <a href="/learn-more" className={styles.link}>Learn More</a>
      </p>
      <p className={styles.pBox}>
        By signing up, you agree to our{" "}
        <a href="/terms" className={styles.link}>Terms</a>,{" "}
        <a href="/privacy-policy" className={styles.link}>Privacy Policy</a> and{" "}
        <a href="/cookies-policy" className={styles.link}>Cookies Policy</a>
      </p>
    </div>
  );
}

export default InfoText;