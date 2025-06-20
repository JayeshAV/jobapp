
exports.allowroles=(...roles)=>{

    return (req,res,next)=>{

        const userRole = req.user?.role

        if(!userRole) return res.status(404).json({message:"User role not found"})
        
        if(!roles.includes(userRole)) return res.status(403).json({message:"Access Denied : Insufficient permission"})

        next()

    }

}