import fs from 'fs'
import imagekit from '../configs/imageKit.js'
import Blog from '../models/Blog.js'
import Comment from '../models/comment.js'
import main from '../configs/gemini.js'

export const addBlog= async (req,res)=>{
    try {
        const {title,subTitle,description,category,isPublished}=JSON.parse(req.body.blog)
        const imageFile=req.file

        if(!title||!description||!category||!imageFile){
            return res.json({success:false,message:"Missing required Fields"})
        }
        const fileBuffer=fs.readFileSync(imageFile.path)

        //uploading image to imageKit
        const response=await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        })

        //optimization through imagekit 
        const optimizedImageUrl=imagekit.url({
            path:response.filePath,
            transformation:[
                {quality:'auto'},       //Auto compression
                {format:'webp'},        //convert to modern format
                {width:'1280'}          // width resizing
            ]
        })

        const image=optimizedImageUrl
        await Blog.create({
            title,subTitle,description,category,image,isPublished
        })

        res.json({success:true, message:"Blog added Sucessfully"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const getAllBlogs=async(req,res)=>{
    try {
        const blogs= await Blog.find({isPublished:true})
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

export const addComment=async(req,res)=>{
    try {
        const {name,blog,content}=req.body
        await Comment.create({blog,name,content})
        res.json({success:true,message:"comment added for review"})
    } catch (error) {
            res.json({success:false, message:error.message})
    }
}

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


