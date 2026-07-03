// TODO: Replace with trained NLP classifier
// ML teammate: use SMS phishing dataset + synthetic scam script corpus
// Recommended model: IndicBERT fine-tuned on scam transcripts (see TRD section 3.2)
// Input: transcript (string), callerId (string), sessionId (string)
// Output shape must match below exactly

const SCAM_PATTERNS = {
  digital_arrest: [
    'digital arrest', 'cbi', 'enforcement directorate', 'ed officer',
    'customs officer', 'under arrest', 'fir registered', 'warrant issued',
    'do not tell anyone', 'stay on call', 'narcotics', 'money laundering',
    'supreme court', 'central bank', 'rbi officer', 'income tax officer',
  ],
  kyc_fraud: [
    'kyc expired', 'kyc update', 'account blocked', 'otp',
    'share screen', 'remote access', 'anydesk', 'teamviewer',
    'aadhar link', 'pan verification', 'bank account suspended',
  ],
  lottery_scam: [
    'won lottery', 'prize money', 'lucky winner', 'claim your prize',
    'processing fee', 'won a car', 'bumper prize', 'lucky draw',
  ],
  investment_scam: [
    'guaranteed returns', 'double your money', 'crypto investment',
    'whatsapp group', 'stock tips', '10x returns', 'risk free',
    'telegram group', 'daily profit',
  ],
}

export const analyseScam = async (transcript, callerId, sessionId) => {
  const lower = transcript.toLowerCase()
  let scamType = null
  let flaggedPhrases = []
  let maxMatches = 0

  for (const [type, patterns] of Object.entries(SCAM_PATTERNS)) {
    const matches = patterns.filter(p => lower.includes(p))
    if (matches.length > maxMatches) {
      maxMatches = matches.length
      scamType = type
      flaggedPhrases = matches
    }
  }

  const confidence = parseFloat(Math.min(0.5 + maxMatches * 0.12, 0.98).toFixed(2))
  const verdict =
    maxMatches === 0
      ? 'legitimate'
      : maxMatches < 2
      ? 'suspect'
      : 'confirmed_scam'

  const actionMap = {
    legitimate: 'No immediate threat detected. Stay vigilant.',
    suspect: 'Exercise caution. Do not share OTP or personal details.',
    confirmed_scam: 'Terminate call immediately. Report to 1930.',
  }

  return {
    verdict,
    confidence,
    scam_type: scamType,
    flagged_phrases: flaggedPhrases,
    recommended_action: actionMap[verdict],
    alert_generated: verdict === 'confirmed_scam',
    session_id: sessionId,
  }
}
