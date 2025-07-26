import express from 'express'
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllCommentsAdmin, getDashBoardData } from '../controllers/adminController.js'
import auth from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

const adminRouter=express.Router()

adminRouter.post("/login",adminLogin)
adminRouter.get("/blogs", auth, isAdmin, getAllBlogsAdmin)
adminRouter.get("/comments", auth, isAdmin, getAllCommentsAdmin)
adminRouter.post("/approve-comment", auth, isAdmin, approveCommentById)
adminRouter.post("/delete-comment", auth, isAdmin, deleteCommentById)
adminRouter.get("/dashboard", auth, isAdmin, getDashBoardData)

export default adminRouter