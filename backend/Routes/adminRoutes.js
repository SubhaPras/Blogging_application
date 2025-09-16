import express from "express"
import { blockUser, deleteBlog, deleteUser, getAllBlogs, getAllInfo, getAllUsers, getBlockedUser, login, logout, register, unblockUser } from "../controllers/adminController.js";
import isAdmin from "../middleware/adminAuth.js";

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/allUsers', isAdmin, getAllUsers )
router.get('/allBlogs', isAdmin, getAllBlogs)
router.get('/getallinfo', isAdmin, getAllInfo)
router.delete('/user/delete/:userId', isAdmin, deleteUser);
router.delete('/blog/delete/:id', isAdmin, deleteBlog)
router.post('/blockuser/:userId', isAdmin, blockUser)
router.get("/blockedUsers", isAdmin,getBlockedUser )
router.delete("/unblockUser/:id", isAdmin, unblockUser )


export default router

