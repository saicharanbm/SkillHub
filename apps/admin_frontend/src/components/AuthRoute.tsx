import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import Spinner from "./shimmer/Spinner";

const AuthRoute = ({
  children,
  isProtected = true,
}: {
  children: JSX.Element;
  isProtected: boolean;
}) => {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full  flex justify-center items-center ">
        <Spinner />
      </div>
    );
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
