import express from 'express';
import { streamChat } from '../controllers/aiChatbotController';

const router = express.Router();

/**
 * AI Chatbot Routes
 */

// Stream chat responses with meeting context
router.post('/stream', streamChat);

export default router;
