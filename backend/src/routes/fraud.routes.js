import { Router } from 'express'
import { analyseCSV } from '../controllers/fraud.controller.js'
import { uploadCSV } from '../middleware/upload.middleware.js'

const router = Router()

// POST /api/v1/fraud/analyse
// Content-Type: multipart/form-data
// Field: file (CSV in PaySim schema, max 50MB)
router.post('/analyse', (req, res, next) => {
  uploadCSV(req, res, (err) => {
    if (err) return next(err)
    analyseCSV(req, res, next)
  })
})

export default router
