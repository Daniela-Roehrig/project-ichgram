import styles from "./TextField.module.css";

const TextField = ({ name, register, rules, error, ...props }) => {
  if (typeof register !== "function") {
    console.error("TextField error: register is not a function", { name, register });
    return null;
  }

  return (
    <div>
      <input
        {...register(name, rules)}
        {...props}
        className={styles.textField}
      />
      {error && <p className={styles.textFieldError}>{error.message}</p>}
    </div>
  );
};

export default TextField;
