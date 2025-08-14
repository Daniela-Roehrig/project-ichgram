import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

import AuthLayout from "../../shared/components/AuthLayout/AuthLayout";
import AuthContentBox from "../../shared/components/AuthContentBox/AuthContentBox";
import AuthFooter from "../../shared/components/AuthFooter/AuthFooter";
import Error from "../../shared/components/Error/Error";
import SuccessMessage from "../../shared/components/Success/Success";

import LoginForm from "./LoginForm/LoginForm";

import { selectAuth } from "../../redux/auth/auth_selector";
import { useAppDispatch } from "../../shared/hooks/hooks";
import { login, verify } from "../../redux/auth/auth_thunks";

import styles from "./Login.module.css";

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [successVerify, setSuccessVerify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorVerify, setErrorVerify] = useState(null);
  const { error, token } = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const verificationCode = searchParams.get("verificationCode");

  useEffect(() => {
    if (verificationCode) {
      const fetchVerify = async () => {
        try {
          const response = await dispatch(verify({ code: verificationCode })).unwrap();
          setSuccessMessage(response.message);
          setSuccessVerify(true);
          setSearchParams();
        } catch (error) {
          setErrorVerify(error.message);
        }
      };
      fetchVerify();
    }
  }, [verificationCode, dispatch, setSearchParams]);

   useEffect(() => {
    if (token) {
      navigate("/home");
          }
  }, [token, navigate]);

  const submitForm = (payload) => {
    dispatch(login(payload));
  };

  return (
    <>
      <div className={styles.img}>
        <img src="../../src/assets/img/BigPicture.png" alt="Background" />
      </div>

      <AuthLayout>
        {successVerify && <SuccessMessage>{successMessage}</SuccessMessage>}

        <AuthContentBox
          childrenForm={
            <LoginForm submitForm={submitForm} />
          }
          showImage
          toLink="/api/auth/forgot-password"
          linkText="Forgot password?"
          isOrDevider
        />

        {errorVerify && <Error>{errorVerify}</Error>}
     
        <AuthFooter
          text="Don't have an account?"
          linkText="Sign up"
          toLink="/api/auth/register"
        />
      </AuthLayout>
    </>
  );
};

export default Login;
