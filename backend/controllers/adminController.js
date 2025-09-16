import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import Blog from "../models/blogModel.js"
import Comment from "../models/commentModel.js"
import BlockedUser from "../models/blockedUserModel.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin)
      return res.json({ success: false, message: "Admin already Exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json({
      success: true,
      message: "Admin Created",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ success: false, message: "all fields are required" });
    const admin = await Admin.findOne({ email });
    if (!email) return res.json({ success: false, message: "No Admin found" });
    const checkPassword = await bcrypt.compare(password, admin.password);
    if (!checkPassword)
      return res.json({ success: false, message: "invalid Credential" });
    const token = jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_SECRET_KEY,
      { expiresIn: "1d" }
    );
    return res.cookie("adminToken", token).json({
      success: true,
      message: "Welcome to admin page",
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {});

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const adminId = req.id;

    if (!adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Admin ID not found" });
    }

    const users = await User.find();

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching users",
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const adminId = req.id;
    if(!adminId) return res.json({success : false, message : "no admin Id found"});
    const blogs = await Blog.find().populate("author", "firstName lastName email");
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getAllInfo = async (req, res) => {
  try {
    const adminId = req.id
    if(!adminId) return res.json({message : "No Admin ID found"});
    const users = await User.find()
    const blogs = await Blog.find()
    const comments = await Comment.find()
    return res.json({
      success : true,
      message : "Information found",
      userCount : users.length,
      blogCount : blogs.length,
      commentCount : comments.length
    })
  } catch (error) {
    return res.json({
      success : false,
      message : error.message
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;   
    const adminId = req.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Admin",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const adminId = req.id;
    if(!adminId) return res.json({message : "no admin found"});
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
     console.error("Delete Blog Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const blockUser = async(req, res) => {
  try {
    const userId = req.params.userId;
    const adminId = req.id;
    if(!adminId) return res.json({success : false, message : "unauthenticated Admin"});
    const user = await User.findById(userId);
    if(!user) return res.json({success : false, message : 'No User found'});
    const email = user.email;
    const alreadyBlocked = await BlockedUser.findOne({email})
    if(alreadyBlocked){
      await BlockedUser.deleteOne({email})
      return res.json({
        success : true,
        message : `You Unblocked ${email} user`
      })
    }    
    const blockedUser = await BlockedUser.create({email})
    const removeUser = await User.findOneAndDelete({email})
    return res.json({
      success : true,
      message : `You blocked ${email} user`
    })

    
  } catch (error) {
    return res.json({
      success : false,
      message : error.message
    })
  }
}

export const getBlockedUser = async (req, res) => {
 try {
    const users = await BlockedUser.find();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const unblockUser = async(req, res) => {
   try {
    const { id } = req.params;
    await BlockedUser.findByIdAndDelete(id);
    res.json({ success: true, message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}