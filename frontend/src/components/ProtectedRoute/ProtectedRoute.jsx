import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading/Loading";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading text="Loading..." />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// Outlet 
// The Outlet component in React Router is a placeholder that allows child route components to be rendered within a parent route