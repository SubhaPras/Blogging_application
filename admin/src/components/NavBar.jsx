import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/admin/logout",{}, { withCredentials: true })
      if (res.data.success) {
        localStorage.removeItem("token"); 
      navigate("/login"); 
      toast.success(res.data.message)
      }else {
        toast.warning("logout failed")
      }
      
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <nav className="navbar">
      <h2 className="logo">ADMIN</h2>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-item">Home</Link>
        </li>
        <li>
          <Link to="/users" className="nav-item">Users</Link>
        </li>
        <li>
          <Link to="/blockedUsers" className="nav-item">Blocked</Link>
        </li>
        <li>
          <Link to="/blogs" className="nav-item">Blogs</Link>
        </li>
      </ul>

      <div className="nav-actions">
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
