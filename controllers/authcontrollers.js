const bcrypt = require('bcryptjs')
const db = require('../config/db');
const jwt = require('jsonwebtoken')

exports.UserRegister = async (req, res) => {

    const name = req.body.name?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error', err });
       if (results.length > 0) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        try {
            const hashedPass = await bcrypt.hash(password, 10);
            db.query(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                [name, email, hashedPass, 'user'],
                (err, results) => {
                    if (err) return res.status(400).json({ message: "DB Error", err });

                    return res.status(201).json({ message: "User registered successfully!" });
                }
            );
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong", error });
        }
    });
};

exports.Loginuser = (req, res) => {

    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: "All fields are required!" });
   
    try {
        db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()],
            async (err, results) => {
                if (err) return res.status(500).json({ message: 'DB error', err });
                if (results.length === 0) return res.status(404).json({ message: "User Not Found ! Please Login" })

                let user = results[0]

                const ismatch = await bcrypt.compare(password, user.password)
                if (!ismatch) return res.status(401).json({ message: "Invalid Password" })

                const secretkey = process.env.JWT_SECRET || "secret123"
                const token = jwt.sign({ id: user.id, role: user.role }, secretkey, { expiresIn: "1d" })

                res.status(200).json({
                    message: "login succesffuly",
                    token,
                    user: {
                        id: user.id,
                        role: user.role
                    }
                })
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }

}

exports.adminPanel = (req, res) => {
    let user = req.user
    if (!user) return res.status(404).json({ message: "User Not Found" })
    res.status(200).json({ message: `Wecome ${user} admin panel` })
}

exports.allUsers = (req, res) => {
    try {
        db.query("SELECT id , name , email ,role FROM users",
            (err, results) => {
                if (err) return res.status(500).json({ message: 'DB error', err });
                const filterUsers = results.filter((e) => e.role === "user")
                return res.status(200).json(filterUsers)
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.UserGet = (req, res) => {

    const { id } = req.params
    if (!id) return res.status(404).json({ message: "User not found" })

    try {
        db.query("SELECT id , name , email , role , resume FROM users WHERE id = ?", [id],
            (err, results) => {
                if (err) return res.status(500).json({ message: 'DB error', err });
                if (results.length === 0) return res.status(404).json({ message: "user not found !" })
                res.status(200).json(results[0])
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.Userupdate = (req, res) => {

    const { id } = req.params
    if (!id) return res.status(404).json({ message: "User not found" })

    const { name, role } = req.body

    if (!name || !role) return res.status(400).json({ message: "Only Name and role fields are required !" })
    
    try {
        db.query("UPDATE users SET name = ? , role = ? WHERE id = ?", [name, role, id],
            (err, results) => {
                if (err) return res.status(500).json({ message: "DB error" })
                return res.status(200).json({ message: "User Updated Successfully !" })
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.updateprofile = (req, res)  => {

    const { id } = req.params
    if (!id) return res.status(404).json({ message: "User not found" })

    const { name } = req.body
    const resumeFile = req.file

    if (!name) return res.status(400).json({ message: "Only Name and resume fields are required !" })

    try {
        db.query("SELECT * FROM users WHERE id = ?", [id],
            (err, result) => {
                if (err) { return res.status(500).json({ message: "DB error" }) }

                var user = result[0]
                // console.log(user)
                var userreume=user?.resume
              
                var updatedResume = resumeFile ? `/uploads/resumes/${resumeFile.filename}` : userreume;

                db.query("UPDATE users SET name = ? , resume = ? WHERE id = ?", [name, updatedResume, id],
                    (err, results) => {
                        if (err) return res.status(500).json({ message: "DB error" })
                        return res.status(200).json({ message: "User Updated Successfully !" })
                    }
                )
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}

exports.Userdelete = (req, res) => {
    const { id } = req.params
    if (!id) return res.status(404).json({ message: "user not found !" })

    try {
        db.query("DELETE FROM users WHERE id = ?", [id],
            (err, results) => {
                if (err) return res.status(500).json("DB error", err)
                return res.status(200).json("User Deleted Successfully !")
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}
