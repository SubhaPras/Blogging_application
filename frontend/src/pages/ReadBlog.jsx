// ReadBlog.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ReadBlog.css";
import { toast } from "react-toastify";

const ReadBlog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const fetchBlog = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/blog/fetchblog/${blogId}`
      );

      if (res.data.success) {
        setBlog(res.data.blog);
        // setComments(res.data.blog.comments || []);
        setLikesCount(res.data.blog.likes?.length);
        setLiked(res.data.blog.likes?.includes(res.data.userId));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blog");
    }
  };

 const fetchComments = async () => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/blog/fetchComments/${blogId}`
    );
    if (res.data.success) {
      setComments(res.data.comments || []);  // 👈 pick comments only
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
    if (blogId) {
      fetchBlog();
      fetchComments();      
    }
  }, [blogId]);

  

 const handleLike = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      `http://localhost:3000/api/blog/like/${blogId}`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
      toast.success(res.data.liked ? "Like added" : "Like removed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to like blog");
  }
};


  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/blog/comment/${blogId}`,
        { text: commentInput },
        { withCredentials: true }
      );

      if (res.data.success) {
        // setComments([...comments, res.data.comment]);
        setCommentInput("");
        fetchComments();
        toast.success("comment added");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error posting comment");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="read-blog-container">
      <h1 className="title">{blog.title}</h1>
      <h3>{blog.subtitle}</h3>
      <p className="category">Category: {blog.category}</p>
      {blog.thumbnail && (
        <img src={blog.thumbnail} alt="thumbnail" className="blog-thumbnail" />
      )}
      <div
        className="blog-description"
        dangerouslySetInnerHTML={{ __html: blog.description }}
      />

      {/* Like Button */}
      <div className="like-section">
        <button onClick={handleLike} className='like-btn'>
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <span className="likes-count">{likesCount} likes</span>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>

        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div key={i} className="comment">
                <p>
                  <strong>
                    {c.author
                      ? `${c.author.firstName} ${c.author.lastName}`
                      : "Anonymous"}
                    :
                  </strong>{" "}
                  {c.content}
                </p>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBlog;
