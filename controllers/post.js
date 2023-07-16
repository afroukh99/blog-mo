import db from '../db.js';
import jwt from "jsonwebtoken";
export const getPosts = (req, res) => {
    const query =
        req.query.cat
            ? "SELECT * FROM posts p JOIN categories c ON p.idCat = c.idCat AND c.label=?"
            : "SELECT * FROM posts p JOIN categories c ON p.idCat=c.idCat"

    db.query(query, [req.query.cat], (err, data) => {
        if (err) return console.log(err)
        return res.status(200).json(data)
    })
}


export const getPost = (req, res) => {
    const query = "SELECT * FROM posts p JOIN users u ON p.idUser=u.idUser  JOIN categories g On g.idCat=p.idCat AND p.id =?"
    db.query(query, [req.params.id], (err, data) => {
        if (err) return res.status(500).res.json('Error')
        return res.status(200).json(data[0])
    })
}


export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) res.status(401).json('not authenticated!')
    jwt.verify(token, 'jwtKey', (err, infos) => {
        if (err) return res.status(500).json('invalid token')
        const query = 'SELECT idCat FROM categories WHERE label=?'
        db.query(query, [req.body.label], (err, result) => {
            if (err) return console.log(err)
            console.log(result)
            const q = "INSERT INTO posts (`title`,`descp`,`img`,`date`,`idCat`,`idUser`) VALUES (?)"
            const values = [
                req.body.title,
                req.body.descp,
                req.body.img,
                req.body.date,
                result[0].idCat,
                infos.id
            ]
            db.query(q, [values], (err, data) => {
                if (err) return console.log(err)
                return console.log('post has been saved successfully!!')
            })
        })


    })

}


export const UpdatePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) res.status(401).json('not authenticated!')
    jwt.verify(token, 'jwtKey', (err, infos) => {
        if (err) return res.status(500).json('invalid token')
        const query = 'SELECT idCat FROM categories WHERE label= ?'
        db.query(query, [req.body.label], (err, data) => {
            if (err) return console.error(err)
            const q = "UPDATE posts p JOIN categories c ON p.idCat = c.idCat SET p.title = ? , p.descp =? , p.img =? ,c.idCat=? WHERE p.id=? and p.idUser=?"
            const values = [
                req.body.title,
                req.body.descp,
                req.body.img,
                data[0].idCat,
            ]
            console.log(data[0].idCat)
            db.query(q, [...values, req.params.id, infos.id], (err, data) => {
                if (err) return console.log(err)
                return res.status(200).json('Post has been updated!')
            })
        })
    })
}


export const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) res.status(401).json('not authenticated!')
    jwt.verify(token, 'jwtKey', (err, infos) => {
        if (err) return res.status(500).json('invalid token')
        console.log(req.params)
        const query = "DELETE FROM posts WHERE `id`= ? AND `idUser`= ?";
        db.query(query, [req.params.id, infos.id], (err, data) => {
            if (err) return console.log(err)
            return res.status(200).json('Post has been deleted!')
        })
    })
}