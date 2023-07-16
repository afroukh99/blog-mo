import express from 'express';
import {regester,login,logout} from '../controllers/auth.js'

const router = express.Router();


router.post('/regester',regester)
router.post('/login',login)
router.post('/logout',logout)




export default router;