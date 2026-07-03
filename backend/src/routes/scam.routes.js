import { Router } from 'express'
import { analyseTranscript } from '../controllers/scam.controller.js'
import { validateScamAnalysis } from '../middleware/validate.middleware.js'

const router = Router()

// POST /api/v1/scam/analyse
router.post('/analyse', validateScamAnalysis, analyseTranscript)

export default router
