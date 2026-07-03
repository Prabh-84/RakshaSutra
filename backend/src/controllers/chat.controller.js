import { processChat } from '../services/chat.service.js'

export const sendMessage = async (req, res, next) => {
  try {
    const { message, language = 'en', session_id } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required in request body.' })
    }
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required in request body.' })
    }

    const result = await processChat(message.trim(), language, session_id)
    res.json(result)
  } catch (err) {
    // Handle missing API key gracefully
    if (err.message?.includes('API key')) {
      return res.status(503).json({
        error: 'ANTHROPIC_API_KEY not configured. Set it in your .env file.',
        timestamp: new Date().toISOString(),
      })
    }
    next(err)
  }
}
