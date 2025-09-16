import React, { useEffect, useState } from "react";
import "./Blog.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchAllBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/blog/allBlogs", {
        withCredentials: true,
      });
      if (res.data.success) {
        setBlogs(res.data.blogs); 
        setFilteredBlogs(res.data.blogs);
        const uniqueCats = [
          ...new Set(res.data.blogs.map((blog) => blog.category || "Uncategorized")),
        ];
        setCategories(uniqueCats);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);


  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((blog) => blog.category === category));
    }
  };

  return (
    <div className="user-blogs-container">
      <h2 className="heading">All Blogs</h2>

     
      <div className="filter-container">
        <select
          value={selectedCategory}
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option value="All">All</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="no-blogs">No blogs found in this category.</p>
      ) : (
        <div className="blogs-grid">
          {filteredBlogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <img
                src={blog.thumbnail || "https://via.placeholder.com/300"}
                alt={blog.title}
                className="thumbnail"
              />
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="category">{blog.category}</p>
                <p className="category">{new Date(blog.createdAt).toDateString()}</p>
                <p className="description">
                  {blog.description?.slice(0, 100)}...{" "}
                  <a
                    onClick={() => {
                      navigate(`/readblog/${blog._id}`);
                    }}
                  >
                    Read more
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
