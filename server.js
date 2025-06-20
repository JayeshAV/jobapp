const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const app = express()
const authroutes = require("./routes/auth")
const authjobs = require("./routes/jobs")
const authapp = require("./routes/application")
const path = require('path')

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Server is running!" })
})

app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

app.use("/api/auth", authroutes)
app.use("/api/jobs", authjobs)
app.use("/api/job", authapp)

const PORT = 8000
app.listen(PORT, "0.0.0.0", () => {
    console.log(`server running on the port 🚀 http://192.168.1.22:${PORT}`)
})