import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./UserBlogs.css";
import DashNavbar from "./DashNavbar";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(false); // for delete dialog

  const navigate = useNavigate();

  // Fetch blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/blog/myblogs", {
          withCredentials: true,
        });

        if (res.data.success) {
          setBlogs(res.data.blogs);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  const handleDeleteClick = (blog) => {
  setSelectedBlog(blog); // open dialog for this blog
};

const confirmDelete = async () => {
try {
      const res = await axios.delete(
        `http://localhost:3000/api/blog/deleteBlog/${selectedBlog._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Blog deleted successfully");
        setBlogs((prev) => prev.filter((blog) => blog._id !== selectedBlog._id));
        setSelectedBlog(false)
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting blog");
    }
};

const cancelDelete = () => {
  setSelectedBlog(false);
};


  console.log(blogs);
  

  if (loading) return <p className="loading">Loading blogs...</p>;

  return (
    <>
    <DashNavbar />
    <div className="user-blogs-container">
      <h2 className="heading">My Blogs</h2>

      {blogs.length === 0 ? (
        <p className="no-blogs">You havenot created any blogs yet.</p>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <img
                src={blog.thumbnail || "https://via.placeholder.com/300"}
                alt={blog.title}
                className="thumbnail"
              />
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="category">{blog.category}</p>
                <p className="category">{blog.createdAt}</p>
                <p className="description">
                  {blog.description?.slice(0, 100)}... <a onClick={() => {navigate(`/readblog/${blog._id}`)}}>Read more</a>
                </p>
                
                <div className="actions">
                  <button
                    className="update-btn"
                    onClick={() => navigate(`/createblog/${blog._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(blog)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedBlog && (
  <div className="dialog-overlay">
    <div className="dialog-box">
      <h3>Confirm Delete</h3>
      <p>
        Are you sure you want to delete <strong>{selectedBlog.title}</strong>?
      </p>
      <div className="dialog-actions">
        <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
        <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
      </div>
    </div>
  </div>
)}


    </div>
    </>
  );
};

export default UserBlogs;
