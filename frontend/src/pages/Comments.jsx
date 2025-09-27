import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Comments.css";
import { toast } from "react-toastify";
import DashNavbar from "./DashNavbar";

const Comments = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/fetchUserComments", {
        withCredentials: true,
      });
      if (res.data.success) {
        setComments(res.data.comments);
        toast.success("Comment Fetched Success")
      }
    } catch (error) {
      console.log("Error fetching comments:", error.message);
    }
  };

  
  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/user/deleteComment/${commentId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message)
      }else {
        toast.error("failed to delete")
      }
    } catch (error) {
      console.log("Error deleting comment:", error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  console.log(comments)

  return (
    <>
    <DashNavbar />
    <div className="comments-page">
      <h2>📝 My Comments</h2>
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments posted yet.</p>
        ) : (
          comments.map((comment) => (
            <div className="comment-card" key={comment._id}>
              <img
                src={comment.blog?.thumbnail}
                alt="Blog Thumbnail"
                className="blog-image"
              />
              <div className="comment-info">
                <h3 className="title-blog">{comment.blog?.title}</h3>
                <p className="comment-content">{comment.content}</p>
                <small className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
                <button
                  className="delete-btn"
                  onClick={() => deleteComment(comment._id)}
                >
                 🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
};

export default Comments;

