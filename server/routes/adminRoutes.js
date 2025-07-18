import express from 'express'
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllCommentsAdmin, getDashBoardData } from '../controllers/adminController.js'
import auth from '../middleware/auth.js'

const adminRouter=express.Router()

adminRouter.post("/login",adminLogin)
adminRouter.get("/blogs",auth,getAllBlogsAdmin)
adminRouter.get("/comments",auth,getAllCommentsAdmin)
adminRouter.post("/approve-comment",auth,approveCommentById)
adminRouter.post("/delete-comment",auth,deleteCommentById)
adminRouter.get("/dashboard",auth,getDashBoardData)

export default adminRouter