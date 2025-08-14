import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import AuthLayout from "../../shared/components/AuthLayout/AuthLayout";
import AuthContentBox from "../../shared/components/AuthContentBox/AuthContentBox";
import AuthFooter from "../../shared/components/AuthFooter/AuthFooter";
import SignupForm from "./SignupForm/SignupForm"; 
import SuccessMessage from "../../shared/components/Success/Success";

import { selectAuth } from "../../redux/auth/auth_selector";
import { register } from "../../redux/auth/auth_thunks";
import { clearAuthError } from "../../redux/auth/auth_slice"; 

const Signup = () => {
  const [successVerify, setSuccessVerify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { error } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const submitForm = useCallback(
    async (payload) => {
      try {
        const response = await dispatch(register(payload)).unwrap();
        setSuccessMessage(response.message);
        setSuccessVerify(true);
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <AuthLayout>
      {successVerify && <SuccessMessage>{successMessage}</SuccessMessage>}

      <AuthContentBox
        childrenForm={<SignupForm submitForm={submitForm} backendError={error} />}
        showImage
        text={
          <>
            Sign up to see photos and videos <br />
            from your friends.
          </>
        }
      />

      <AuthFooter text="Have an account? " linkText="Log in" toLink="/" />
    </AuthLayout>
  );
};

export default Signup;
