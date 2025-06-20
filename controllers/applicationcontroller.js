const db = require("../config/db")

exports.postApp = (req, res) => {

    const { job_id, resume_url, cover_letter } = req.body

    const user_id = req.user?.id
    if (!user_id) return res.status(404).json({ message: 'user_id not found !' })

    if (!job_id || !resume_url || !cover_letter) {
        return res.status(400).json({ message: "All Fields are required !" })
    }

    try {
        db.query("SELECT * FROM applications WHERE job_id = ? AND user_id = ? ", [job_id, user_id],
            (err, results) => {
                if (err)  return res.status(500).json({ message: "DB error" }) 
                if (results.length > 0) return res.status(409).json({ message: "You already submitted the applications" })

                db.query("INSERT INTO applications (job_id,resume_url,cover_letter,user_id) VALUES (?,?,?,?)", [job_id, resume_url, cover_letter, user_id],
                    (err, results) => {
                        if (err) return res.status(500).json({ message: "Db Error" })
                        return res.status(200).json({ message: "Application submitted successfully!" });
                    }
                )
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.getme = (req, res) => {

    const user_id = req.user?.id
    if (!user_id) return res.status(404).json({ message: "user id not found !" })

    try {
        db.query(
            `SELECT a.*, j.title, j.company, j.salary_range, j.location
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             WHERE a.user_id = ?
             ORDER BY a.created_at DESC`,
           [user_id]
            , (err, results) => {
                if (err) return res.status(500).json({ message: "DB error", error: err });
                if (results.length === 0) return res.status(404).json({ message: "Applications not found" });
                
                return res.status(200).json(results);
            }
        )
    } catch (error) {
       return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.getallapplications=(req,res)=>{
    try {
        db.query("SELECT * FROM applications",
            (err,result)=>{
                if(err) return res.status(500).json({ message: "DB error", error: err });
                return res.status(200).json(result)
            }
        )
    } catch (error) {
        return res.status(500).json({message:"Something went wrong",error})
    }
}

exports.getapplicationForjob=(req,res)=>{

        const {job_id} = req.params
        if(!job_id) return res.status(404).json({message:'Application not found !'})
        
        try {  
                    db.query("SELECT * FROM applications WHERE job_id = ? ",[job_id],
                        (err,result)=>{
                            if(err) return res.status(500).json({message:'application not found !'})
                            if(result.length===0) return res.status(404).json({message:"no application found for this job"})
                             return res.status(200).json(result)
                        }
                    )
        } catch (error) {
           return res.status(500).json({message:"Something went wrong"})            
        }
}