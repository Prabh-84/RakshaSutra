export const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || 'unknown'
  const timestamp = new Date().toISOString()

  // Log full error server-side
  console.error(`[${timestamp}] [${requestId}] ${req.method} ${req.path} — ERROR: ${err.message}`)
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack)
  }

  // Multer file size exceeded
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large. Check the maximum file size limit.',
      request_id: requestId,
      timestamp,
    })
  }

  // Multer unexpected field
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      error: `Unexpected file field: ${err.field}`,
      request_id: requestId,
      timestamp,
    })
  }

  // CORS errors
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({
      error: err.message,
      request_id: requestId,
      timestamp,
    })
  }

  // JSON parse error (malformed body)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON in request body.',
      request_id: requestId,
      timestamp,
    })
  }

  // Generic — never expose internal details in production
  const isDev = process.env.NODE_ENV === 'development'
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'An internal server error occurred.',
    request_id: requestId,
    timestamp,
    ...(isDev && err.stack ? { stack: err.stack } : {}),
  })
}
