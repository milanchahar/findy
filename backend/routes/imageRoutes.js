import express from 'express';
import { upload, uploadImage, uploadImages } from '../controllers/imageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/single', upload.single('image'), uploadImage);
router.post('/multiple', upload.array('images', 10), uploadImages);

export default router;
