import fs from 'fs'
import imagekit from '../configs/imageKit.js'
import Blog from '../models/Blog.js'
import Comment from '../models/comment.js'
import main from '../configs/gemini.js'

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required Fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;

    // 💡 Check if req.user has _id (i.e., a regular user)
    let blogData = {
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
      createdBy: req.user?.name || req.user?.email || "Unknown",
    };

    // If it's a user (not admin), attach user ID
    if (req.user.role === "user") {
  blogData.user = req.user.id || req.user._id;
}
    console.log("Creating blog for user:", req.user);
    console.log("blogData:", blogData);
    await Blog.create(blogData);

    res.json({ success: true, message: "Blog added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllBlogs=async(req,res)=>{
    try {
        const blogs= await Blog.find({isPublished:true}).sort({createdAt:-1})
    res.json({success:true,blogs})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not Found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById= async(req,res)=>{
    try {
        const {id}=req.body
        await Blog.findByIdAndDelete(id)
        res.json({success:true,message:"Blog Deleted Sucessfully"})

        //deleting the comments associated with blog
        await Comment.deleteMany({blog:id})
    } catch (error) {
        
        res.json({success:false, message:error.message})
    }
}

export const togglePublish=async(req,res)=>{
    try {
        const {id}=req.body
        const blog= await Blog.findById(id)
        blog.isPublished=!blog.isPublished      //to toggle
        await blog.save()
        res.json({success:true,message:"blog status updated"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const addComment = async (req, res) => {
  try {
    console.log("req.body in controller:", req.body);
    console.log("req.user from auth middleware:", req.user);

    const { blog, content } = req.body;

    if (!blog || !content) {
      return res.status(400).json({ success: false, message: "Blog and content are required" });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please login to comment." });
    }

    // Explicitly set userId and name based on user role
    let userId, userName;

    if (req.user.role === "admin") {
      userId = null;            // Admin doesn't exist in Users collection
      userName = "Admin";       // Hardcoded name for admin
    } else {
      userId = req.user.id;     // From auth middleware (normal user)
      userName = req.user.name; // From auth middleware (normal user)
    }

    await Comment.create({
      blog,
      user: userId,     
      name: userName,
      content,
    });

    res.json({ success: true, message: "Comment added for review" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments=async(req,res)=>{
    try {
        const {blogId}  =req.body
        const comments=await Comment.find({blog:blogId,isApproved:true}).sort({createdAt:-1})
        res.json({success:true,comments})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const generateContent=async(req,res)=>{
    try {
        const {prompt}=req.body
        const content= await main(prompt+ 'Generate a blog content for this topic in a simple text format')
        res.json({success:true,content})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


