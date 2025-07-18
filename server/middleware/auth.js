import jwt from 'jsonwebtoken'

const auth= (req,res,next)=>{
     const authHeader = req.headers.authorization; 
    const token = authHeader?.split(" ")[1];
    
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.json({sucess:false, message:"Invalid Token"})
    }
}

export default auth