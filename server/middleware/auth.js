import jwt from "jsonwebtoken";
import User from "../models/User.js"; // import User model

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Received auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    if (decoded.role === "admin" && decoded.email === process.env.ADMIN_MAIL) {
      req.user = {
        id: "admin", // set string ID for admin
        name: "Admin",
        email: decoded.email,
        role: "admin"
      };
      return next();
    }
    // 🔥 Fetch full user (excluding password)
    const user = await User.findById(decoded.id).select("-password");
  
    req.user = {
      id: user._id,
      name: user.name,         // ✅ now available in controller
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default auth;
