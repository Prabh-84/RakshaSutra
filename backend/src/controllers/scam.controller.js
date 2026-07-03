import { analyseScam } from '../services/scam.service.js'

export const analyseTranscript = async (req, res, next) => {
  try {
    const { transcript, caller_id, session_id } = req.body

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'transcript is required in request body.' })
    }
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required in request body.' })
    }

    const result = await analyseScam(transcript.trim(), caller_id || 'UNKNOWN', session_id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
