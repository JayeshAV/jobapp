const express = require('express')
const { UserRegister,Loginuser, adminPanel, UserGet, Userupdate, Userdelete, allUsers, updateprofile } = require('../controllers/authcontrollers')
const { allowroles } = require('./role')
const { verifyToken } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const router = express.Router()

router.post("/signup", UserRegister)
router.post("/signin", Loginuser)
router.get("/users",allUsers)
router.get("/user/:id",UserGet)
router.put("/user/:id",verifyToken,allowroles('admin'),Userupdate)
router.delete("/user/:id",verifyToken,allowroles('admin'),Userdelete)
router.put("/updateprofile/:id",upload.single('resume'),verifyToken,allowroles('user'),updateprofile)
router.get("/admin",verifyToken,allowroles('admin'), adminPanel)


module.exports = router
