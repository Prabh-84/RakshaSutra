export const chatScenarios = [
  {
    id: "cbi_call",
    trigger: "I received a call from someone claiming to be CBI",
    quickLabel: "🚨 CBI/Police Call",
    steps: [
      {
        type: "bot",
        text: "⚠️ I'll help you assess this immediately. Let me ask a few quick questions:",
        delay: 800,
      },
      {
        type: "bot",
        text: "1️⃣ Did the caller ask you to stay on a video call?\n2️⃣ Did they mention an FIR, arrest warrant, or money laundering case?\n3️⃣ Did they ask you to transfer money to a 'safe account' or 'government account'?",
        delay: 1200,
      },
      {
        type: "user_auto",
        text: "Yes to all three — they said I'm under digital arrest",
      },
      {
        type: "bot",
        text: null,
        verdict: {
          level: "danger",
          title: "🔴 HIGH RISK — DIGITAL ARREST SCAM DETECTED",
          confidence: 0.97,
          details: "This matches a known 'Digital Arrest' scam pattern used by organised crime networks. Real CBI/ED officers NEVER arrest people over video calls.",
          actions: [
            "❌ Disconnect the call IMMEDIATELY",
            "❌ Do NOT transfer any money",
            "❌ Do NOT share OTP, Aadhaar, or bank details",
            "✅ Call 1930 — National Cyber Crime Helpline",
            "✅ I can help you file an FIR with NCRB — type REPORT",
            "✅ Inform your family members right away",
          ],
        },
        delay: 1500,
      },
      {
        type: "bot",
        text: "📊 The caller's number has been flagged and reported to MHA I4C. 23 other citizens have reported this same number in the last 48 hours.\n\nWould you like me to help you file a complaint? Type REPORT to begin.",
        delay: 1000,
      },
    ],
  },
  {
    id: "otp_request",
    trigger: "Someone is asking for my OTP",
    quickLabel: "🔑 OTP Request",
    steps: [
      {
        type: "bot",
        text: "⚠️ OTP sharing requests are a major red flag. Let me assess the situation:",
        delay: 800,
      },
      {
        type: "bot",
        text: "Quick questions:\n1️⃣ Who is asking — bank, delivery, government official?\n2️⃣ Did they call you, or did you call them?\n3️⃣ Is there a pending transaction you initiated?",
        delay: 1200,
      },
      {
        type: "user_auto",
        text: "A bank manager called and said my account will be blocked if I don't share OTP",
      },
      {
        type: "bot",
        text: null,
        verdict: {
          level: "danger",
          title: "🔴 HIGH RISK — OTP PHISHING SCAM",
          confidence: 0.95,
          details: "No bank ever calls customers to ask for OTP. This is a social engineering attack designed to steal money from your account.",
          actions: [
            "❌ NEVER share OTP with anyone — not even 'bank officials'",
            "❌ Do not click any links they send",
            "✅ Hang up and call your bank's official helpline (from the back of your card)",
            "✅ If you already shared OTP, call your bank immediately to block the account",
            "✅ Report at cybercrime.gov.in or call 1930",
          ],
        },
        delay: 1500,
      },
    ],
  },
  {
    id: "upi_request",
    trigger: "I got a suspicious UPI payment request",
    quickLabel: "💳 Suspicious UPI",
    steps: [
      {
        type: "bot",
        text: "Let me help you verify this UPI request. A few questions:",
        delay: 800,
      },
      {
        type: "bot",
        text: "1️⃣ Do you know the person/business sending the request?\n2️⃣ Were you expecting this payment request?\n3️⃣ Is the amount correct for any purchase you made?",
        delay: 1200,
      },
      {
        type: "user_auto",
        text: "I don't know them. They say I won a lottery and need to pay processing fee.",
      },
      {
        type: "bot",
        text: null,
        verdict: {
          level: "danger",
          title: "🔴 HIGH RISK — LOTTERY/PRIZE SCAM",
          confidence: 0.99,
          details: "Lottery/prize scams ask victims to pay 'processing fees' to claim non-existent prizes. No legitimate lottery requires advance payment.",
          actions: [
            "❌ DECLINE the payment request immediately",
            "❌ Do not pay any 'processing fee' or 'tax'",
            "❌ Block the sender on UPI",
            "✅ Report the UPI ID to your payment app (GPay/PhonePe/Paytm)",
            "✅ File complaint at cybercrime.gov.in",
          ],
        },
        delay: 1500,
      },
    ],
  },
  {
    id: "customs_parcel",
    trigger: "Someone called about a parcel stuck in customs",
    quickLabel: "📦 Customs Parcel",
    steps: [
      {
        type: "bot",
        text: "Customs parcel scams are currently trending. Let me check:",
        delay: 800,
      },
      {
        type: "bot",
        text: "1️⃣ Did they mention illegal items (drugs, contraband) in the parcel?\n2️⃣ Are they asking for payment to 'release' the parcel?\n3️⃣ Did they transfer you to a 'police officer' or 'narcotics officer'?",
        delay: 1200,
      },
      {
        type: "user_auto",
        text: "Yes, they said my parcel has drugs and I need to pay a fine or I'll be arrested",
      },
      {
        type: "bot",
        text: null,
        verdict: {
          level: "danger",
          title: "🔴 HIGH RISK — CUSTOMS IMPERSONATION SCAM",
          confidence: 0.96,
          details: "This is a well-documented customs impersonation scam. Real customs officials never call citizens to demand payment over phone. Notices are always sent officially in writing.",
          actions: [
            "❌ Hang up immediately",
            "❌ Do NOT pay any 'fine' or 'clearance fee'",
            "✅ If you have a genuine parcel concern, visit indiapost.gov.in or call 1800-11-2011",
            "✅ Report this number at cybercrime.gov.in",
            "✅ Call 1930 — National Cyber Crime Helpline",
          ],
        },
        delay: 1500,
      },
    ],
  },
  {
    id: "safe_query",
    trigger: "My bank called about a new credit card offer",
    quickLabel: "✅ Bank Offer",
    steps: [
      {
        type: "bot",
        text: "Let me help you verify this. A few questions:",
        delay: 800,
      },
      {
        type: "bot",
        text: "1️⃣ Did they ask for any OTP, CVV, or full card number?\n2️⃣ Did they ask you to download any app or click a link?\n3️⃣ Is the call from a number listed on your bank's official website?",
        delay: 1200,
      },
      {
        type: "user_auto",
        text: "No, they just informed me about an offer and asked me to visit the branch. No personal details asked.",
      },
      {
        type: "bot",
        text: null,
        verdict: {
          level: "safe",
          title: "🟢 LOW RISK — Likely Legitimate",
          confidence: 0.88,
          details: "This appears to be a standard bank marketing call. Legitimate bank calls typically do NOT ask for sensitive information like OTP, CVV, or passwords.",
          actions: [
            "✅ You can verify by calling your bank's official helpline",
            "✅ Visit your nearest branch to learn more about the offer",
            "ℹ️ Remember: Never share OTP/CVV even if the caller claims to be from your bank",
          ],
        },
        delay: 1500,
      },
    ],
  },
];

export const supportedLanguages = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ" },
  { code: "as", label: "Assamese", nativeLabel: "অসমীয়া" },
];
