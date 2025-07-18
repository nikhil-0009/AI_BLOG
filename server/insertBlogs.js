import mongoose from "mongoose";
import blogData from "./blogData.js";
import dotenv from 'dotenv'
import Blog from "./models/Blog.js";

dotenv.config()
const insertData=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ai_blog`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
     console.log('✅ MongoDB connected to:', mongoose.connection.name);

    await Blog.insertMany(blogData);
    console.log('🎉 Blogs inserted successfully!');

    mongoose.disconnect();
    } catch (error) {
         console.error('❌ Error inserting blogs:', error);
    mongoose.disconnect();
    }
}
insertData()