
import {
  FiUser,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";

import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef(null);

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "";

  // Close the menu when the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={assets.logo} alt="TodoApp logo" className="navbar-logo" />
        <span>TodoApp</span>
      </Link>

      <div className="profile" ref={menuRef}>
        <button
          className="avatar"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open profile menu"
        >
          {initial}
        </button>

        {menuOpen && (
          <div className="dropdown">
            <div className="dropdown-header">
              <p className="dropdown-name">{user?.name}</p>
              <p className="dropdown-email">{user?.email}</p>
            </div>

            <button className="menu-item" onClick={() => goTo("/account")}>
              <FiUser /> My account
            </button>

            <button
              className="menu-item"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <FiSettings />
              <span className="menu-grow">Settings</span>
              {settingsOpen ? <FiChevronDown /> : <FiChevronRight />}
            </button>

            {settingsOpen && (
              <div className="settings-panel">
                <p className="settings-label">Appearance</p>
                <div className="theme-toggle">
                  <button
                    className={`theme-btn ${theme === "light" ? "active" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <FiSun /> Light
                  </button>
                  <button
                    className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <FiMoon /> Dark
                  </button>
                </div>
              </div>
            )}

            <button className="menu-item danger" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;