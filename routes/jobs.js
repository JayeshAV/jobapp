const express = require('express')
const { postjob, getAllJobs, deleteJob, getjobbyid , UpdateJob} = require('../controllers/jobcontroller')
const { verifyToken } = require('../middlewares/auth')
const { allowroles } = require('./role')
const router = express.Router()


router.post("/createjob",verifyToken,allowroles('admin'),postjob)
router.get("/alljobs",getAllJobs)
router.get("/job/:id",getjobbyid)
router.delete("/job/:id",verifyToken,allowroles('admin'),deleteJob)
router.put("/updatejob/:id",verifyToken,allowroles('admin'),UpdateJob)


module.exports=router