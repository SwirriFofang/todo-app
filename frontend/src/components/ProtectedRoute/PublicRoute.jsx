import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading/Loading";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading text="Loading..." />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;