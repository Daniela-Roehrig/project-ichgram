import TextField from "../../../shared/components/TextField/TextField";
import Button from "../../../shared/components/Button/Button";
import inputs from "../../data/inputs";

import styles from "./AuthForm.module.css";

import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

const AuthForm = ({ textBtn, submitForm, fieldsToRender, children, backendError }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const firstRender = useRef(true);

  useEffect(() => {
    if (!backendError) return;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    
    if (backendError.toLowerCase().includes("email")) {
      setError("email", { type: "manual", message: backendError });
    } else if (backendError.toLowerCase().includes("username")) {
      setError("username", { type: "manual", message: backendError });
    } else {
      setError("root", { type: "manual", message: backendError });
    }
  }, [backendError, setError]);

  const onSubmit = (values) => {
    clearErrors();
    submitForm(values);
    reset();
  };

  const elements = fieldsToRender.map((fieldName) => {
    const field = inputs[fieldName];

    if (!field) {
      console.warn(`Field "${fieldName}" not found`);
      return null;
    }

    return (
      <TextField
        key={field.name}
        {...field}
        name={field.name}
        register={register}
        rules={field.rules}
        error={errors[field.name]} 
      />
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.textFieldsBox}>{elements}</div>
      {children}
      

      {errors.root && <p className={styles.textFieldError}>{errors.root.message}</p>}
      
      <div className={styles.btnBox}>
        <Button
          text={textBtn}
          type="submit"
        />
      </div>
    </form>
  );
};

export default AuthForm;
