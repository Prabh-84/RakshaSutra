import { Router } from 'express'
import { sendMessage } from '../controllers/chat.controller.js'
import { validateChatMessage } from '../middleware/validate.middleware.js'
import { chatLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

// POST /api/v1/chat/message
router.post('/message', chatLimiter, validateChatMessage, sendMessage)

export default router
