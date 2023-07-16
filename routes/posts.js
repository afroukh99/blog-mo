import express from 'express';
import { addPost,getPost,getPosts,UpdatePost,deletePost } from '../controllers/post.js';

const router = express.Router();

router.post('/',addPost)
router.get('/',getPosts)
router.get('/:id',getPost)
router.put('/:id',UpdatePost)
router.delete('/:id',deletePost)




export default router;