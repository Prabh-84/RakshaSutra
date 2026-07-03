/**
 * RakshaSutra — Centralized API Client
 *
 * Set VITE_API_URL in .env to point to the backend.
 * If VITE_USE_MOCK=true (or API_URL is not set), all calls fall back to mock data.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// Helper: Setup auth header interceptor
// Note: Assuming a fetch-based wrapper that checks for Authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// === AUTH ENDPOINTS ===

export async function loginApi(email, password) {
  if (USE_MOCK) {
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      user: { name: 'Demo User', email, role: 'state_officer', clearanceLevel: 'CONFIDENTIAL' },
      token: 'mock-token'
    }), 1000))
  }
  return await apiFetch('/auth/login', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }) 
  })
}

export async function signupApi(userData) {
  if (USE_MOCK) {
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      user: userData,
      token: 'mock-token'
    }), 1000))
  }
  return await apiFetch('/auth/signup', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData) 
  })
}

export async function getProfileApi() {
  if (USE_MOCK) {
    return { success: true, user: { name: 'Demo User', role: 'state_officer' } }
  }
  return await apiFetch('/auth/me', { method: 'GET' })
}

export async function updateProfileApi(data) {
  if (USE_MOCK) {
    return { success: true, user: data }
  }
  return await apiFetch('/auth/profile', { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data) 
  })
}

// === API CALLS ===

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout

  try {
    const authHeaders = getAuthHeaders()
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'X-Request-ID': `frontend_${Date.now()}`,
        ...authHeaders,
        ...options.headers,
      },
    })

    clearTimeout(timeout)

    if (!res.ok) {
      let errBody
      try { errBody = await res.json() } catch { errBody = { error: `HTTP ${res.status}` } }
      throw new APIError(errBody.error || `Request failed (${res.status})`, res.status)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      throw new APIError('Request timed out. Please try again.', 408)
    }
    throw err
  }
}

// ─── Custom error type ────────────────────────────────────────────────────────
export class APIError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

// ─── NagrikShield: Send chat message ─────────────────────────────────────────
export async function sendChatMessage({ message, language = 'en', session_id }) {
  if (USE_MOCK) {
    return mockChatResponse(message)
  }
  return apiFetch('/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, session_id }),
  })
}

// ─── Scam Sentinel: Analyse transcript ───────────────────────────────────────
export async function analyseScamTranscript({ transcript, caller_id, session_id }) {
  if (USE_MOCK) {
    return mockScamResponse(transcript)
  }
  return apiFetch('/scam/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, caller_id, session_id }),
  })
}

// ─── NoteSure: Analyse currency image ────────────────────────────────────────
export async function analyseCurrencyImage(imageFile) {
  if (USE_MOCK) {
    return mockCurrencyResponse()
  }
  const form = new FormData()
  form.append('image', imageFile)
  return apiFetch('/currency/analyse', { method: 'POST', body: form })
}

// ─── FraudGraph: Analyse CSV ──────────────────────────────────────────────────
export async function analyseFraudCSV(csvFile) {
  if (USE_MOCK) {
    return mockFraudResponse()
  }
  const form = new FormData()
  form.append('file', csvFile)
  return apiFetch('/fraud/analyse', { method: 'POST', body: form })
}

// ─── CrimeMap: Get events ─────────────────────────────────────────────────────
export async function getCrimeEvents(filters = {}) {
  if (USE_MOCK) {
    return mockCrimeEvents(filters)
  }
  const params = new URLSearchParams()
  if (filters.state) params.set('state', filters.state)
  if (filters.type) params.set('type', filters.type)
  if (filters.severity) params.set('severity', filters.severity)
  const qs = params.toString()
  return apiFetch(`/crime/events${qs ? `?${qs}` : ''}`)
}

// ─── Health check ─────────────────────────────────────────────────────────────
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE_URL.replace('/api/v1', '')}/health`, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MOCK FALLBACKS — used when VITE_USE_MOCK=true or backend unreachable
// ══════════════════════════════════════════════════════════════════════════════

function mockChatResponse(message) {
  return new Promise(resolve => setTimeout(() => {
    const lower = message.toLowerCase()
    const isDanger = lower.includes('cbi') || lower.includes('arrest') || lower.includes('ed officer') || lower.includes('fir')
    const isSuspicious = lower.includes('otp') || lower.includes('kyc') || lower.includes('upi') || lower.includes('bank')
    resolve({
      response: isDanger
        ? 'This is a serious Digital Arrest scam. No government agency (CBI/ED/Customs) will ever arrest you over a video or phone call. Hang up immediately and call 1930.'
        : isSuspicious
        ? 'This sounds suspicious. Do NOT share your OTP, PIN, or bank details with anyone. Legitimate institutions never ask for these over call or message.'
        : 'Your situation does not match known scam patterns right now, but stay cautious. Never share OTP or personal details with strangers.',
      risk_verdict: isDanger ? 'danger' : isSuspicious ? 'suspicious' : 'safe',
      helpline: isDanger || isSuspicious ? '1930' : null,
      confidence: isDanger ? 0.95 : isSuspicious ? 0.78 : 0.60,
      session_id: `mock_${Date.now()}`,
    })
  }, 1200))
}

function mockScamResponse(transcript) {
  const lower = transcript.toLowerCase()
  const flagged = []
  if (lower.includes('cbi')) flagged.push('cbi')
  if (lower.includes('arrest')) flagged.push('digital arrest')
  if (lower.includes('do not tell')) flagged.push('do not tell anyone')
  if (lower.includes('otp')) flagged.push('otp')
  const isScam = flagged.length >= 2
  return Promise.resolve({
    verdict: isScam ? 'confirmed_scam' : flagged.length ? 'suspect' : 'legitimate',
    confidence: isScam ? 0.93 : flagged.length ? 0.62 : 0.15,
    scam_type: lower.includes('arrest') ? 'digital_arrest' : lower.includes('otp') ? 'kyc_fraud' : null,
    flagged_phrases: flagged,
    recommended_action: isScam ? 'Terminate call immediately. Report to 1930.' : 'Stay vigilant.',
    alert_generated: isScam,
    session_id: `mock_${Date.now()}`,
  })
}

function mockCurrencyResponse() {
  return new Promise(resolve => setTimeout(() => resolve({
    verdict: 'suspect',
    confidence: 0.91,
    denomination: 500,
    flagged_regions: [
      { label: 'Security Thread', x: 120, y: 45, w: 10, h: 200 },
      { label: 'Microprint Zone', x: 340, y: 180, w: 60, h: 20 },
      { label: 'UV Luminescence', x: 80, y: 220, w: 40, h: 40 },
    ],
    gradcam_url: null,
    scan_id: `SCAN_MOCK_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }), 1800))
}

function mockFraudResponse() {
  return new Promise(resolve => setTimeout(() => resolve({
    clusters: [
      { cluster_id: 'C001', risk_tier: 'HIGH', node_count: 14, edge_count: 38, risk_score: 0.91,
        nodes: [
          { id: 'ACC_001', type: 'account', risk_score: 0.88, label: 'Mule Account' },
          { id: 'SIM_001', type: 'sim', risk_score: 0.82, label: 'Burner SIM' },
        ],
        edges: [{ source: 'ACC_001', target: 'SIM_001', amount: 45000, type: 'TRANSFER', step: 12 }],
      },
      { cluster_id: 'C002', risk_tier: 'MEDIUM', node_count: 7, edge_count: 11, risk_score: 0.63, nodes: [], edges: [] },
    ],
    total_accounts: 4821,
    flagged_accounts: 143,
    processing_time_ms: 1240,
    session_id: `FRAUD_SESSION_MOCK_${Date.now()}`,
  }), 2000))
}

function mockCrimeEvents(filters) {
  // Import dynamically to avoid circular deps — use the frontend data file
  return import('../data/crimeEvents.js').then(m => {
    let events = m.crimeEvents || []
    if (filters.state) events = events.filter(e => e.state === filters.state)
    if (filters.type) events = events.filter(e => e.type === filters.type)
    if (filters.severity) events = events.filter(e => e.severity === filters.severity)
    return { events, total: (m.crimeEvents || []).length, filtered: events.length }
  })
}
