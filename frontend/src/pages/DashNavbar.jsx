import React from "react";
import "./DashNav.css";
import { Link } from "react-router-dom";

const DashNavbar = () => {
  return (
    <div className="navContainer">
      <div className="dash-navbar">
        <button> <Link to="/profile">PROFILE</Link></button>
        <button> <Link to="/yourblog">YOUR BLOGS</Link></button>
        <button> <Link to="/comments">COMMENTS</Link></button>
        <button> <Link to="/createblog">CREATE BLOG</Link></button>
      </div>
    </div>
  );
};

export default DashNavbar;
