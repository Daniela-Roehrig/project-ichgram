import styles from "./Button.module.css";

const Button = ({ text, type = "button", onClick, disabled = false }) => {
  return (
    <button onClick={onClick} className={styles.btn} type={type} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
