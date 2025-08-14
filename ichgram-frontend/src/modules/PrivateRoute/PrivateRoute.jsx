import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { token } = useUser();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
