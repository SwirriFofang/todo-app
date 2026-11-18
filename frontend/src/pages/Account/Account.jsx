import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Account.css";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My account</h1>
      </div>

      <div className="account-card">
        <div className="account-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="account-row">
          <span className="account-label">Full name</span>
          <span className="account-value">{user.name}</span>
        </div>
        <div className="account-row">
          <span className="account-label">Email</span>
          <span className="account-value">{user.email}</span>
        </div>

        <button className="btn btn-outline" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Account;