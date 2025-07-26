import express from 'express'
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from '../controllers/BlogController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'

const blogRouter=express.Router()

blogRouter.post('/add',upload.single('image'),auth,addBlog)
blogRouter.get('/all',getAllBlogs)
blogRouter.get('/:id',getBlogById)
blogRouter.post('/delete',auth,deleteBlogById)
blogRouter.post('/toggle-publish',auth,togglePublish)
blogRouter.post('/add-comment',auth,addComment)
blogRouter.post('/comments',getBlogComments)
blogRouter.post('/generate',auth,generateContent)

export default blogRouter