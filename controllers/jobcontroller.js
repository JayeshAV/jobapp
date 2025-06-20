const db = require("../config/db")

exports.postjob = (req, res) => {

        const { title, salary_range, description, company, location } = req.body
        const user_id = req.user.id

        if (!title || !salary_range || !description || !company || !location) return res.status(400).json({ message: "All Fields are required !" })
        if (!user_id) return res.status(404).json({ message: "user id not found" })

        try {
            db.query("INSERT INTO jobs (title,salary_range,description,company,location,created_by) VALUES (?,?,?,?,?,?)", [title, salary_range, description,  company,location, user_id],
                (err, results) => {
                    if (err) return res.status(500).json({ message: "DB Error" })
                    return res.status(201).json({ message: "Job Created Successfully !" })
                }
            )
        } catch (error) {
            return res.status(500).json({ message: "something went wrong " })

        }
    }

exports.getAllJobs = (req, res) => {


    try {

    const {search,page,limit}=req.query

    if(!page || !limit) return res.status(400).json({message:"Page and limit is required !"})

    var sql = "SELECT * FROM jobs WHERE 1 = 1 "
    const params =[]

         if(search){
            sql=sql+" AND ( title LIKE ? OR description LIKE ? OR company LIKE ? OR location LIKE ? OR salary_range LIKE ? )"
            const serachlike=`%${search}%`
            params.push(serachlike,serachlike,serachlike,serachlike,serachlike)
         }

         const pagenumber =parseInt(page)
         const limitNumber =parseInt(limit)
         const offset=(pagenumber-1)*limit

         sql+=" LIMIT ? OFFSET ?"
         params.push(limitNumber,offset)

         db.query("SELECT * FROM jobs",
            (err,jobs)=>{
                if(err) return res.status(500).json({message:"DB Error"})

            db.query(sql,params,
                (err, results) => {
                    if (err) return res.status(500).json({ message: "DB Error" })
                    if (results.length === 0) return res.status(404).json({ message: "Job not Found" })
                    return res.status(200).json({
                     currentPage:page,   
                     limit: limit,
                     totolJobs:jobs.length,
                     jobs:results
            })
                }
            )


            }
         )
  

            
        } catch (error) {
            return res.status(500).json({ message: "something went wrong " })
        }
    }

exports.deleteJob = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "Job ID is not found !" });

    try {
        db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.error("Error in SELECT:", err);  
                return res.status(500).json({ message: "DB Error", error: err });
            }
            if (results.length === 0) return res.status(404).json({ message: "Job not found" });
            
            db.query("DELETE FROM jobs WHERE id = ?", [id], (err, results) => {
                if (err) {
                    console.error("Error in DELETE:", err);  
                    return res.status(500).json({ message: "DB Error", error: err });
                }

                return res.status(200).json({ message: "Job deleted successfully" });
            });
        });
    } catch (error) {
        console.error("Catch Block Error:", error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.getjobbyid = (req, res) => {

    const { id } = req.params
    if (!id) return res.status(404).json({ message: "Job not found" })

    try {
        db.query("SELECT id,title,description,company,location,salary_range,created_by FROM jobs WHERE id = ?", [id],
            (err, results) => {
                if (err) return res.status(500).json({ message: "DB Error" })
                if (results.length === 0) return res.status(404).json({ message: "Job not Found" })
  return res.status(200).json(results[0])
                // db.query("SELECT * FROM jobs WHERE id = ?", [id],
                //     (err, results) => {
                //         if (err) return res.status(500).json({ message: "DB Error" })
                //         if (results.length === 0) return res.status(404).json({ message: "Job not Found" })
                      
                //     }
                // )
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "something went wrong " })
    }
}

exports.UpdateJob=(req,res)=>{
       const { id } = req.params
       if (!id) return res.status(404).json({ message: "Job not found" })
        
    const {title,salary_range,description,company,location} = req.body

      if (!title || !salary_range || !description || !company || !location) return res.status(400).json({ message: "All Fields are required !" })
        
    try {
        db.query("UPDATE jobs SET title = ? , salary_range = ? , description = ? , company = ? , location = ?  WHERE id = ?",[title,salary_range,description,company,location,id],
            (err,results)=>{
              if (err) return res.status(404).json({ message: "Job not found" })
             return res.status(200).json({ message: "Job Update Successfully !" })
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "something went wrong " })  
    }
}


