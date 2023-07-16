import db from '../db.js';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

export const regester = (req, res) => {
    const { username, email, password } = req.body;
    // Checking if user exists
    const query = "SELECT * FROM users WHERE username=? OR email= ?"
    db.query(query, [username, email], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json('User already exists!');
        // Hashing password 
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        //creating new user
        const query = "INSERT INTO users (`username`,`email`, `password`) VALUES  (?) ";
        const values = [username, email, hash]
        db.query(query, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('User created successfully!');
        })

    })
}

export const login = (req, res) => {
    const { username } = req.body;
    const query = "SELECT * FROM users WHERE username =?";
    db.query(query, [username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json('User not found!');
        // Check password is correct
        const validPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!validPassword)
            return res.status(400).json('Invalid username or password!');

        const token = jwt.sign({ id: data[0].idUser }, "jwtKey");
        console.log(data[0].idUser)
        const { password, ...infos } = data[0]
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(infos)
    })
}


export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json('User logged out')
}