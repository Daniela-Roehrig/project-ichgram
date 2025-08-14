import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../../../context/UserContext";
import AuthForm from "../../../shared/components/AuthForm/AuthForm";

const LoginForm = () => {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState("");
  const { setToken } = useUser(); 

  const onSubmitForm = async (values) => {
    setBackendError(""); 

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: values.email,
        password: values.password,
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        setToken(token); 
        navigate("/home");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        if (error.response.data.message === "User not verified") {
          setBackendError("Please verify your email before logging in.");
        } else {
          setBackendError("Invalid email or password.");
        }
      } else {
        setBackendError("An unexpected error occurred. Please try again.");
        console.error("Login error:", error);
      }
    }
  };

  return (
    <AuthForm
      textBtn="Log in"
      submitForm={onSubmitForm}
      fieldsToRender={["email", "password"]}
      backendError={backendError}
    />
  );
};

export default LoginForm;
