import { Router } from 'express'
import { getEvents } from '../controllers/crime.controller.js'
import { validateCrimeQuery } from '../middleware/validate.middleware.js'

const router = Router()

// GET /api/v1/crime/events?state=&type=&severity=
router.get('/events', validateCrimeQuery, getEvents)

export default router
