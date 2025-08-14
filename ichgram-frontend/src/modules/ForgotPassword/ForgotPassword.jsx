import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";

import AuthLayout from "../../shared/components/AuthLayout/AuthLayout";
import AuthContentBox from "../../shared/components/AuthContentBox/AuthContentBox";
import AuthFooter from "../../shared/components/AuthFooter/AuthFooter";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";
import Lock from "../../assets/icons/Lock.jsx";
import SuccessMessage from "../../shared/components/Success/Success";
import Error from "../../shared/components/Error/Error";

import { selectAuth } from "../../redux/auth/auth_selector";
import { useAppDispatch } from "../../shared/hooks/hooks";
import { forgotPassword } from "../../redux/auth/auth_thunks";

const ForgotPassword = () => {
  const [successVerify, setSuccessVerify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { error } = useSelector(selectAuth);
  const dispatch = useAppDispatch();

  const submitForm = useCallback(
    async (payload) => {
      const response = await dispatch(forgotPassword(payload)).unwrap();
      setSuccessMessage(response.message);
      setSuccessVerify(true);
    },
    [dispatch]
  );

  return (
    <>
  
    <AuthLayout>
      {successVerify && <SuccessMessage>{successMessage}</SuccessMessage>}

      <AuthContentBox
        childrenForm={<ForgotPasswordForm submitForm={submitForm} />}
        icon={<Lock />}  
        textTitle="Trouble logging in?"
        textDescription="Enter your email and we'll send you a link to get back into your account."
        isOrDevider
        authLinkText="Create new account"
        authLinkTo="/api/auth/register"
      />

      <AuthFooter linkText="Back to login" toLink="/" />
    </AuthLayout>
    </>
  );
};

export default ForgotPassword;
