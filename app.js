import express from "express";
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import multer from 'multer';


const port = 8800
const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+file.originalname)
    }
  })
  
  const upload = multer({ storage })


app.use('/api/upload',upload.single('file'),(req,res)=> {
    const file = req.file;
    res.status(200).json(file.filename)
})

app.use("/api/", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/posts", postRoutes);



app.listen(port, () => {
    console.log(`server listening on port ${port} ..`)
})  