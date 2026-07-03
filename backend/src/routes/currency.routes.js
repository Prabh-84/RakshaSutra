import { Router } from 'express'
import { analyseImage } from '../controllers/currency.controller.js'
import { uploadImage } from '../middleware/upload.middleware.js'

const router = Router()

// POST /api/v1/currency/analyse
// Content-Type: multipart/form-data
// Field: image (JPG or PNG, max 10MB)
router.post('/analyse', (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err) return next(err)
    analyseImage(req, res, next)
  })
})

export default router
