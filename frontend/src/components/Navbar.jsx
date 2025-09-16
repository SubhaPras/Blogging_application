import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  BookA,
  BookOpenText,
  ClipboardPen,
  House,
  LogOut,
  MessageCircle,
  UserRoundPen,
  Menu,
  X
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/fetchuser", {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        console.log("user not fetched in navbar component");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/logout",
        { withCredentials: true }
      );
      if (response.data.Success) {
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Logout success");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/">
            <div className="logo">
              <h1 className="logo-text">THOR</h1>
            </div>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Section */}
        <nav className={`nav-section ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="navButton" onClick={() => setMenuOpen(false)}>
            <House />
            <span>Home</span>
          </Link>
          <Link
            to="/blog"
            className="navButton"
            onClick={() => setMenuOpen(false)}
          >
            <BookOpenText />
            <span>Blogs</span>
          </Link>
          <Link
            to="/about"
            className="navButton"
            onClick={() => setMenuOpen(false)}
          >
            <BookA />
            <span>About</span>
          </Link>

          <div className="nav-right">
            {token ? (
              <div className="auth-links">
                <Link
                  to="/liveChat"
                  className="navButton"
                  onClick={() => setMenuOpen(false)}
                >
                  <MessageCircle />
                  <span>Chat</span>
                </Link>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                  className="avatar-btn"
                >
                  <div className="avatar">
                    <img
                      src={
                        user.photoUrl ||
                        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                      }
                      alt="avatar"
                    />
                  </div>
                </button>
                <button className="button" onClick={handleLogout}>
                  Logout <LogOut />
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link
                  to="/login"
                  className="button"
                  onClick={() => setMenuOpen(false)}
                >
                  Signin <UserRoundPen />
                </Link>
                <Link
                  to="/signup"
                  className="button"
                  onClick={() => setMenuOpen(false)}
                >
                  Signup <ClipboardPen />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
