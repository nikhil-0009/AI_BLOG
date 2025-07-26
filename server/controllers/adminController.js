import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
  try {
    // to check if user entered correct password or not!
    const { email, password } = req.body;
    const matchedPassword =  bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );
    if (!matchedPassword || email !== process.env.ADMIN_MAIL) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    //if pass is correct it will create a jwt token take email as payload.. and send the token in response to frontend
    const token = jwt.sign({ email ,role: "admin" }, process.env.JWT_SECRET);
    res.json({ success: true, token ,user: {
        email,
        role: "admin", 
      },});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({ success: true, message: "Comment Deleted Sucessfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.body;
    await Comment.findByIdAndUpdate(id, { isApproved: true });
    res.json({ success: true, message: "Comment Approved Sucessfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getDashBoardData = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const comments = await Comment.countDocuments();
    const blogs = await Blog.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });
    const dashBoardData = { recentBlogs, blogs, comments, drafts };

    res.json({ success: true, dashBoardData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
