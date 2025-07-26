import express from 'express'
import { userBlogs, userDetails, userLogin, userSignup, userStats } from '../controllers/userController.js'
import auth from '../middleware/auth.js'
const userRouter=express.Router()

userRouter.post("/signup",userSignup)
userRouter.post("/login",userLogin)
userRouter.get("/myblogs",auth ,userBlogs)
userRouter.get("/me",auth ,userDetails)
userRouter.get("/stats/:userId",auth ,userStats)

export default userRouter