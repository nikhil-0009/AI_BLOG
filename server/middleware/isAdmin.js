
const isAdmin=(req,res,next)=>{
if(req.user.role!="admin"){
   return res.status(401).json({success:false,message:'Access denied: Admins only'})
}
next()
}

export default isAdmin