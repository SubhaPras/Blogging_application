import express from 'express';
import { commentBlog, createBlog, deleteBlog, fetchBlog, fetchUserBlogs, fetchBlogComments, likeBlog, updateBlog, fetchAllBlogs, helpToWrite } from '../controllers/blogController.js';
import protect from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/multer.js';


const router = express.Router()

router.post('/', protect, createBlog);
router.put('/:blogId', protect, singleUpload, updateBlog );
router.get('/fetchblog/:blogId', fetchBlog);
router.get('/myblogs', protect, fetchUserBlogs);
router.delete('/deleteBlog/:blogId', protect, deleteBlog); 
router.post('/like/:blogId', protect, likeBlog )
router.post('/comment/:blogId', protect, commentBlog )
router.get('/fetchComments/:blogId', fetchBlogComments )
router.get('/allBlogs',protect, fetchAllBlogs )
router.post('/helpme', helpToWrite )

export default router;