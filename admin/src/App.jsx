import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Users from './pages/Users.jsx'
import Blogs from "./pages/Blogs.jsx";
import LogIn from "./pages/LogIn.jsx";
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from "./pages/Dashboard.jsx";
import BlockedUsers from "./pages/BlockedUsers.jsx";


const App = () => {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blockedUsers" element={<BlockedUsers />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </>
  );
};

export default App;
