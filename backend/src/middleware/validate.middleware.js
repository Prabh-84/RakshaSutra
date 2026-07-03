import { body, query, validationResult } from 'express-validator'

// ─── Shared response helper ───────────────────────────────────────────────────
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
      timestamp: new Date().toISOString(),
    })
  }
  next()
}

// ─── Chat message validation ──────────────────────────────────────────────────
export const validateChatMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('message is required')
    .isLength({ max: 1000 }).withMessage('message cannot exceed 1000 characters')
    .escape(),
  body('language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'ur'])
    .withMessage('Invalid language code'),
  body('session_id')
    .trim()
    .notEmpty().withMessage('session_id is required')
    .isLength({ max: 100 }).withMessage('session_id too long')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('session_id contains invalid characters'),
  handleValidationErrors,
]

// ─── Scam transcript validation ───────────────────────────────────────────────
export const validateScamAnalysis = [
  body('transcript')
    .trim()
    .notEmpty().withMessage('transcript is required')
    .isLength({ max: 5000 }).withMessage('transcript cannot exceed 5000 characters'),
  body('caller_id')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('caller_id too long'),
  body('session_id')
    .trim()
    .notEmpty().withMessage('session_id is required')
    .isLength({ max: 100 }).withMessage('session_id too long')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('session_id contains invalid characters'),
  handleValidationErrors,
]

// ─── Crime events query validation ───────────────────────────────────────────
export const validateCrimeQuery = [
  query('state').optional().trim().isLength({ max: 50 }),
  query('type')
    .optional()
    .isIn(['UPI_Fraud', 'Digital_Arrest', 'OTP_Phishing', 'FICN_Circulation', 'Investment_Fraud', 'Loan_App_Scam'])
    .withMessage('Invalid crime type'),
  query('severity')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Invalid severity level'),
  handleValidationErrors,
]
