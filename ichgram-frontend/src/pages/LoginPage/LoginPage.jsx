import Wrapper from "../../shared/components/Wrapper/Wrapper";
import AuthContainer from "../../shared/components/AuthContainer/AuthContainer";
import Login from "../../modules/Login/Login";

const LoginPage = () => {
  return (
    <main>
        <AuthContainer>
          <Login />
        </AuthContainer>
    </main>
  );
};

export default LoginPage;
