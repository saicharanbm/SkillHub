import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

const AuthRoute = ({
  children,
  isProtected = true,
}: {
  children: JSX.Element;
  isProtected: boolean;
}) => {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isProtected && !userData) {
    return <Navigate to={ROUTES.fallback} />;
  }

  if (!isProtected && userData) {
    return <Navigate to={ROUTES.home} />;
  }

  return children;
};

export default AuthRoute;
