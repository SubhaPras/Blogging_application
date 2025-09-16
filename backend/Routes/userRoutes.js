import express from 'express';
import { analyzeUser, deleteUserComment, fetchUser, fetchUserComments, login, logout, register, update } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router()

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update',protect, singleUpload, update )
router.get('/fetchuser',protect, fetchUser)
router.get("/analysis",protect, analyzeUser )
router.get("/fetchUserComments",protect, fetchUserComments )
router.delete("/deleteComment/:commentId",protect, deleteUserComment )



export default router