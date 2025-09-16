import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowpassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/register",
        formData, {
          headers : {
            "Content-Type" : "application/json"
          },
          withCredentials : true 
        }
      );
      if (res.data.Success) {
       navigate('/login')
        console.log(res.data);
        toast.success("Register Success! Now Login");
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.error(err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type= {showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" className="passwordBtn" onClick={()=> {setShowpassword(!showPassword)}}> { showPassword ? "HIDE" : "SHOW" } </button>
          <button type="submit" className="submitBtn">Sign Up</button>
        </form>
        <div className="login-link">
          <p>Already have an account?</p>
          <a href="/login">Login Here</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
