import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import "./UpdateBlog.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const { blogId } = useParams();

  const [blog, setBlog] = useState(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("category", category);
    formData.append("description", description);
    if (thumbnail) formData.append("file", thumbnail);

    try {
      const res = await axios.put(
        `http://localhost:3000/api/blog/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/yourblog`);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while updating blog");
    }
  };

  const getHelp = async() => {
    try {
      const res = await axios.post('http://localhost:3000/api/blog/helpme', {title, category, description}, {withCredentials : true})
      if(res.data.success){
        toast.success("Help found")
        console.log(res.data)
        setContent(res.data.text)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/blog/fetchblog/${blogId}`
        );

        if (res.data.success) {
          const fetchedBlog = res.data.blog;
          setBlog(fetchedBlog);

          setTitle(fetchedBlog.title ?? "");
          setSubtitle(fetchedBlog.subtitle ?? "");
          setCategory(fetchedBlog.category ?? "");
          setDescription(fetchedBlog.description ?? "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  return (
    <div className="update-page-container">
      <div className="blog-container">
        <h2>Update Blog</h2>

        <form className="blog-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Subtitle */}
          <div className="form-group">
            <label>Subtitle:</label>
            <input
              type="text"
              placeholder="Enter subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              required
            />
          </div>

          {/* Category + Thumbnail in one row */}
          <div className="form-row">
            <div className="form-group half">
              <label>Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">-- Select Category --</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Photography">Photography</option>
              </select>
            </div>

            <div className="form-group half">
              <label>Thumbnail:</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
            </div>
          </div>

          {/* Description with Jodit */}
          <div className="form-group">
            <label>Description:</label>
            <JoditEditor
              ref={editor}
              value={description}
              onBlur={(newContent) => setDescription(newContent)}
            />
          </div>

          {/* Update Button */}
          <button type="submit" className="create-btn">
            Update Blog 🗃️
          </button>

          {/* Help Button */}
          <button
            type="button"
            className="help-btn"
            onClick={() => {setOpen(!open); getHelp()}}
          >
            {open ? "Hide Help" : "Help me to write ✍️"}
          </button>
        </form>
      </div>

      {open && (
        <div className="help-container">
          <h3>Need Help?</h3>
          <p>
            { content }
          </p>
        </div>
      )}
    </div>
  );
};

export default UpdateBlog;
