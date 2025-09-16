import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Blogs.css";
import { toast } from "react-toastify";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/allBlogs", {
        withCredentials: true,
      });
      if (res.data.success) {
        setBlogs(res.data.blogs);
      } else {
        console.error("Failed to fetch blogs:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Open confirmation dialog
  const openDialog = (blog) => {
    setSelectedBlog(blog);
    setShowDialog(true);
  };

  // Close dialog
  const closeDialog = () => {
    setSelectedBlog(null);
    setShowDialog(false);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/admin/blog/delete/${selectedBlog._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setBlogs(blogs.filter((b) => b._id !== selectedBlog._id));
        toast.success(res.data.message)
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      // console.error("Error deleting blog:", error);
      toast.error(error.message)
    } finally {
      closeDialog();
    }
  };

  // Filter blogs by search term (title)
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-blogs-container">
      <h2 className="heading">All Blogs</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by blog title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p className="loading">Loading blogs...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="no-blogs">No blogs found.</p>
      ) : (
        <table className="blogs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.author ? blog.author.firstName + " " + blog.author.lastName : "Unknown"}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => openDialog(blog)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Custom confirmation dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the blog titled{" "}
              <strong>{selectedBlog.title}</strong>?
            </p>
            <div className="dialog-actions">
              <button className="cancel-btn" onClick={closeDialog}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
