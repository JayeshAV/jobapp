const express = require('express')
const { postApp, getme, getallapplications, getapplicationForjob } = require('../controllers/applicationcontroller')
const { allowroles } = require('./role')
const { verifyToken } = require('../middlewares/auth')

const router = express.Router()

router.post("/application",verifyToken,allowroles('user'),postApp)
router.get("/me",verifyToken,allowroles('user'),getme)
router.get("/applications",verifyToken,allowroles("admin"),getallapplications)
router.get("/application/:job_id",verifyToken,allowroles("admin"),getapplicationForjob)

    
module.exports = router