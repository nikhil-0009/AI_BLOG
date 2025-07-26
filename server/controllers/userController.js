import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // encrypting the password

    const newuser = new User({
      //the  saving details of new user in mongoDB with hashed password
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await newuser.save();

    const token = jwt.sign(
      {
        id: newuser._id,
        email: newuser.email,
        role: newuser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(201).json({
      success: true,
      message: "User SingedUp SuccessFully",
      token,
      user: {
        id: newuser._id, // sending this same object again to frontend for faster execution and it won't need to decrypt it
        name: newuser.name,
        email: newuser.email,
        role: newuser.role,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "User with this email does not exists",
        });
    }

    const matchedPassword = bcrypt.compare(password, validUser.password);
    if (!matchedPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password enterd!!" });
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        email: validUser.email,
        role: validUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: validUser._id,
        name: validUser.name,
        email: validUser.email,
        role: validUser.role,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // fetch full details 
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const userStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const blogsCount = await Blog.countDocuments({ user: userId });
    const commentsCount = await Comment.countDocuments({ name: userId });

    res.status(200).json({ blogsCount, commentsCount });
  } catch (error) {
     res.status(500).json({ error: 'Error fetching user stats' });
  }
};
