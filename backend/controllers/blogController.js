import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.json({ message: "Blog title and category is required" });
    }

    const blog = await Blog.create({
      title,
      category,
      author: req.id,
    });

    return res.json({
      success: true,
      message: "Blog Created Successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "failed to create blog",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId);
    if (!blog) return res.json({ message: "Blog not found" });

    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      thumbnail = await cloudinary.uploader.upload(fileUri);
    }

    const updateData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
      thumbnail: thumbnail?.secure_url,
    };
    blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });

    res.json({
      success: true,
      message: "Blog Updated Successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Update failed",
    });
  }
};

export const fetchBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    if (!blogId) {
      return res.json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await Blog.findById(blogId).populate(
      "author",
      "firstName lastName"
    );

    if (blog) {
      return res.json({
        success: true,
        message: "Blog Found",
        blog,
        userId: req.id || req.user?._id,
      });
    } else {
      return res.json({
        success: false,
        message: "Blog not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching blog",
    });
  }
};

export const fetchUserBlogs = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized, user not found",
      });
    }

    const blogs = await Blog.find({ author: userId })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: blogs.length,
      message:
        blogs.length > 0 ? "Blogs fetched successfully" : "No blogs found",
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed to fetch user blogs",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    if (blog.thumbnail) {
      const publicId = blog.thumbnail.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn(
          "Failed to delete thumbnail from Cloudinary:",
          err.message
        );
      }
    }

    // Delete blog from DB
    await Blog.findByIdAndDelete(blogId);

    return res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found",
      });
    }
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Like added",
      likesCount: blog.likes.length,
      liked: !alreadyLiked,
      userId,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const commentBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.id;
    const content = req.body.text;
    if (!blogId || !userId) {
      return res.json({ success: false, message: "invalid user or blog" });
    }
    const blog = await Blog.findById(blogId);
    if (!blog) return res.json({ success: false, message: "Blog not found" });

    const comment = await Comment.create({
      content: content,
      author: userId,
      blog: blogId,
    });

    blog.comments.push(comment);

    await blog.save();

    res.json({
      success: true,
      message: "Comment Added",
      comment,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchBlogComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "firstName lastName",
      },
    });

    if (!blog) {
      return res.json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      message: "Comments fetched successfully",
      comments: blog.comments, // 👈 send only comments array
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching comments",
    });
  }
};

export const fetchAllBlogs = async (req, res) => {
  try {
    const user = req.id;
    if (!user)
      return res.json({ success: false, message: "Please Login first" });
    const blogs = await Blog.find()
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const helpToWrite = async (req, res) => {
  try {

    const {title, category, description} = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
          Help me to complete this blog:
          Blog Title : ${title},
          Blog Category : ${category}
          BLog Content : ${description}

          write a well-structured article with an introduction, main body, and conclusion. 
          Keep it clear, engaging, and easy to read. Use short paragraphs and subheadings where needed."*
        `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    return res.json({
      success : true,
      text
    })
  } catch (error) {
    return res.json({
      success : false,
      message : error.message
    })
  }
};
