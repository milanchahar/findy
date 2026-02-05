import express from 'express';
import {
  createOrGetConversation,
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/conversation', createOrGetConversation);
router.get('/conversations', getConversations);
router.get('/conversation/:conversationId', getMessages);
router.post('/', sendMessage);

export default router;
