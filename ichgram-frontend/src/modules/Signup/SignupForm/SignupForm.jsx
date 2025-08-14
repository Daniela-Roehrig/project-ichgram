
import AuthForm from "../../../shared/components/AuthForm/AuthForm";
import { useSelector } from "react-redux";
import { selectAuth } from "../../../redux/auth/auth_selector";
import Policy from "../../../shared/components/InfoTexts/InfoTexts";
import { useState } from "react";

const SignupForm = ({ submitForm }) => {
  const { error } = useSelector(selectAuth);
  const [message, setMessage] = useState("");

  const onSubmitForm = async (values) => {
    try {
      await submitForm(values);
      setMessage("Registration successful. Please check your email to verify your account.");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <AuthForm
        submitForm={onSubmitForm}
        fieldsToRender={["email", "fullName", "username", "password"]}
        backendError={error}
        textBtn="Sign up"
      >
        <Policy />
      </AuthForm>
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </>
  );
};

export default SignupForm;
