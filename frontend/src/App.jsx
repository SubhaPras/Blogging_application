import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Blog from "./pages/Blog.jsx";
import Navbar from "./components/Navbar.jsx";
 import { ToastContainer, toast } from 'react-toastify';
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import UpdateBlog from "./pages/UpdateBlog.jsx";
import UserBlogs from "./pages/Userblogs.jsx";
import ReadBlog from "./pages/ReadBlog.jsx";
import Comments from "./pages/Comments.jsx";
import Chat from "./pages/LiveChat.jsx";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/createblog/:blogId" element={<UpdateBlog />} />
          <Route path="/yourblog" element={<UserBlogs />} />
          <Route path="/readblog/:blogId" element={<ReadBlog />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/liveChat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
