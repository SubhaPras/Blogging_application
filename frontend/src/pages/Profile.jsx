import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { Facebook, Github, Instagram, Linkedin } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import DashNavbar from "./DashNavbar";


const Profile = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    facebook: "",
    instagram: "",
    github: "",
    linkedin: "",
    bio: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    // e.preventDefault();
    setLoading(true)
    try {
       const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("facebook", formData.facebook);
    data.append("instagram", formData.instagram);
    data.append("github", formData.github);
    data.append("linkedin", formData.linkedin);
    data.append("bio", formData.bio);
    if (formData.file) {
      data.append("file", formData.file);
    }
      const response = await axios.put(
        "http://localhost:3000/api/user/update",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("user updated successfully");
        // setUser(response.data.user)
        setIsOpen(false);
      } else {
        toast.error('Update failed')
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  };

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/fetchuser", {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
        
        setFormData({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          facebook: res.data.user.facebook || "",
          instagram: res.data.user.instagram || "",
          github: res.data.user.github || "",
          linkedin: res.data.user.linkedin || "",
          bio: res.data.user.bio || "",
          file: null,
        });
      } else {
        toast.error("Failed to fetch user");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Error fetching user");
    }
  };

  fetchUser();
}, []);

 

  return (
    <>
    <DashNavbar />
    <div className="profile-container">
      {/* image section */}
      <div className="image-section">
        <div className="profile-image">
          <img
            src= {user.photoUrl}
            alt=""
          />
        </div>
        <h1> {user.firstName + " " + user.lastName} </h1>
        <div className="links">
          <Link to={user.facebook}>
            <Facebook />
          </Link>
          <Link to={user.instagram}>
            <Instagram />
          </Link>
          <Link to={user.github}>
            <Github />
          </Link>
          <Link to={user.linkedin}>
            <Linkedin />
          </Link>
        </div>
      </div>

      {/* content section */}
      <div className="content-section">
        <div className="content">
          <h1> Welcome {user.firstName}  </h1>
          <h3 className="email">{ user.email }</h3>
          <h3 className="email">About Me</h3>
          <p>{ user.bio }</p>
          <div>
            <button onClick={() => setIsOpen(true)}>
              ✏️ Edit
            </button>

            {isOpen && (
              <div className="dialog-overlay">
                <div className="dialog">
                  <h2>Edit Profile</h2>
                  <p>
                    Make changes to your profile here. Click save when you're
                    done.
                  </p>

                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="facebook">Facebook</label>
                    <input
                      id="facebook"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="instagram">Instagram</label>
                    <input
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="github">Github</label>
                    <input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="file">Photo</label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="dialog-footer">
                    <button
                      className="btn-outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button className="btn" onClick={handleSave} disabled = {loading}>
                      {loading ? "Updating ..." : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
