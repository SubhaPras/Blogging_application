import React, { useState } from "react";
import "./createBlog.css";
// import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import store from "@/redux/store";
// import { setBlog } from "@/redux/blogSlice";
import { toast } from "react-toastify";
import DashNavbar from "./DashNavbar";


const CreateBlog = () => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate()

//   const getSelectedCategoty = (value) => {
//     setCategory(value)
//   }

  const handleSubmit = async() => {
    try {
        const res = await axios.post('http://localhost:3000/api/blog/', {title, category}, {
            headers : {
                "Content-Type" : "application/json",
            },
            withCredentials : true
        })

        if(res.data.success){
            navigate(`/createblog/${res.data.blog._id}`)
            toast.success(res.data.message)
        } else {
            toast.error("something went wrong")
        }
    } catch (error) {
        console.log(error);
        
    }
  };


  return (
    <>
    <DashNavbar/>
    <div>
      <div className="container">
        <h2>Create New Item</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            // onValueChange={getSelectedCategoty}
          >
            <option value="">-- Select Category --</option>
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Photography">Photography</option>
          </select>
        </div>

        <button className="create-btn" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
    </>
  );
};

export default CreateBlog;
