import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  subtitle: String,
  description: String,
  thumbnail: String,
  category: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  isPublished : {
    type: Boolean,
    default : false
  }
}, {timestamps : true});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog