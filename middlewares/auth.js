const jwt=require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || "secret123"

exports.verifyToken=async(req,res,next)=>{

    const authheader = req.headers['authorization']

    if(!authheader) return res.status(403).json({message:"Token missing"})
    
    const token = authheader.split(" ")[1]
    if(!token) return response.status(401).json({message:"Token missing"})

    try {
        const decode =await jwt.verify(token,JWT_SECRET)
        req.user=decode
        next()
    } catch (error) {
        res.status(500).json({message:'server error',error:error})
    }

}