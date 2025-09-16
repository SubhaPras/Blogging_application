import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/userModels.js";
import Blog from "../models/blogModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import Comment from "../models/commentModel.js";
import BlockedUser from "../models/blockedUserModel.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.json({ message: "All field are required" });

    const userExist = await User.findOne({ email: email });

    if (userExist) return res.json({ message: "User already Exists" });

    const blockedUser = await BlockedUser.findOne({ email: email });
    if (blockedUser)
      return res.json({ message: "You can't Create account using this email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.json({ Success: true, message: "User Created Successfully" });
  } catch (error) {
    console.log("reegister failed", error);
    res.json({ Success: false, message: "Registation Failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ message: "please Enter Every field" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "No user found" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token).json({
      token,
      Success: true,
      message: "Login Success",
      user: {
        id: user._id,
        name: user.firstName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("login failed", error);
    res.json({ Success: false, message: "login Failed" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "").json({
      Success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    res.json({
      Success: false,
      message: "Failed Logout",
    });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.id;
    const {
      firstName,
      lastName,
      facebook,
      instagram,
      github,
      linkedin,
      occupation,
      bio,
    } = req.body;

    const file = req.file;
    // const fileUri = getDataUri(file)
    // let cloudResponse = await cloudinary.uploader.upload(fileUri)
    // console.log(cloudResponse);

    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "No User Found",
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.facebook = facebook || user.facebook;
    user.instagram = instagram || user.instagram;
    user.github = github || user.github;
    user.linkedin = linkedin || user.linkedin;
    user.occupation = occupation || user.occupation;
    user.bio = bio || user.bio;

    if (cloudResponse) {
      user.photoUrl = cloudResponse.secure_url;
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchUser = async (req, res) => {
  const userId = req.id;
  try {
    const user = await User.findById(userId);
    res.json({
      success: true,
      message: "fetched successfully",
      user,
    });
  } catch (error) {
    res.json({
      message: "failed fetch user",
    });
  }
};

export const fetchUserComments = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.json({ success: false, message: "Un authenticated User" });
    }

    const comments = await Comment.find({ author: userId })
      .populate("blog", "thumbnail title") 
      .select("content createdAt"); 
    return res.json({
      success: true,
      message: "Comments fetched",
      comments
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUserComment = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.json({ success: false, message: "User not found" });
    }

    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }
    
    await Comment.findByIdAndDelete(commentId);

    return res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


export const analyzeUser = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    const blogs = await Blog.find({ author: userId });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following user profile and blogs:
      Profile: ${user}
      Blogs: ${blogs}

      Provide insights like:
      - User writing style
      - Strength of blogs
      - Suggestions for improvement
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return res.json({
      success: true,
      result: text,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

