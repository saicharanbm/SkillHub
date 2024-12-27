import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import ShimmerCard from "./shimmer/ShimmerCard";

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
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </>
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
