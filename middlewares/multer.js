const multer = require('multer')
const path=require('path')
const fs = require('fs');
const dir = 'uploads/resumes';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/resumes/")
    },
    filename:(req,file,cb)=>{
          const ext = path.extname(file.originalname)
          const filename = `resume-${Date.now()}${ext}`
          cb(null,filename) 
    }
})

const fileFilter =(req,file,cb)=>{
    if(file.mimetype  === "application/pdf"){
        cb(null,true)
    }else{
        cb(new Error('Only PDf Files allowed !'),false)
    }
}

const upload=multer({
    storage:Storage,
    fileFilter:fileFilter,
    limits:{fileSize:10*1024*1024}
})

module.exports = upload