import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'

import { initDb } from './db/database.js'
import authRoutes from './routes/auth.routes.js'
import currencyRoutes from './routes/currency.routes.js'
import fraudRoutes from './routes/fraud.routes.js'
import chatRoutes from './routes/chat.routes.js'
import crimeRoutes from './routes/crime.routes.js'
import scamRoutes from './routes/scam.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

dotenv.config()

// Initialize database
initDb()

const app = express()
const PORT = process.env.PORT || 3000

// ─── Allowed origins (comma-separated in env) ────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

// ─── Security: Helmet (HTTP headers) ─────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...ALLOWED_ORIGINS],
      },
    },
  })
)

// ─── Security: HTTP Parameter Pollution ──────────────────────────────────────
app.use(hpp())

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true)
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
      callback(new Error(`CORS: origin ${origin} not permitted`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
)

// ─── Global rate limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again after 15 minutes.' },
})
app.use(globalLimiter)

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'))
}

// ─── Compression ─────────────────────────────────────────────────────────────
app.use(compression())

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ─── Request ID header ────────────────────────────────────────────────────────
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  res.setHeader('X-Request-ID', req.requestId)
  next()
})

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'RakshaSutra',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    modules: ['currency', 'fraud', 'chat', 'crime', 'scam'],
    uptime_seconds: Math.floor(process.uptime()),
  })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/currency', currencyRoutes)
app.use('/api/v1/fraud', fraudRoutes)
app.use('/api/v1/chat', chatRoutes)
app.use('/api/v1/crime', crimeRoutes)
app.use('/api/v1/scam', scamRoutes)

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  })
})

// ─── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler)

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🛡️  RakshaSutra backend running on http://localhost:${PORT}`)
  console.log(`🌍 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`)
  console.log(`📋 Health check:    http://localhost:${PORT}/health`)
  console.log(`🔗 API base:        http://localhost:${PORT}/api/v1\n`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully')
  server.close(() => process.exit(0))
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason)
})

export default app
