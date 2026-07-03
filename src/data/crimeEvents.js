// Synthetic crime events across India for geospatial heatmap
// ~200 events with lat/lng, type, severity, date, loss amount

const crimeTypes = ['digital_arrest', 'ficn_seizure', 'phishing', 'investment_fraud', 'upi_fraud', 'loan_scam'];

// Major Indian city coordinates with random jitter
const cities = [
  { name: "Mumbai", state: "MH", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", state: "DL", lat: 28.6139, lng: 77.209 },
  { name: "Bengaluru", state: "KA", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", state: "TG", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", state: "TN", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", state: "WB", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", state: "MH", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", state: "GJ", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "RJ", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "UP", lat: 26.8467, lng: 80.9462 },
  { name: "Noida", state: "UP", lat: 28.5355, lng: 77.391 },
  { name: "Gurugram", state: "HR", lat: 28.4595, lng: 77.0266 },
  { name: "Chandigarh", state: "CH", lat: 30.7333, lng: 76.7794 },
  { name: "Bhopal", state: "MP", lat: 23.2599, lng: 77.4126 },
  { name: "Nagpur", state: "MH", lat: 21.1458, lng: 79.0882 },
  { name: "Indore", state: "MP", lat: 22.7196, lng: 75.8577 },
  { name: "Coimbatore", state: "TN", lat: 11.0168, lng: 76.9558 },
  { name: "Kochi", state: "KL", lat: 9.9312, lng: 76.2673 },
  { name: "Visakhapatnam", state: "AP", lat: 17.6868, lng: 83.2185 },
  { name: "Patna", state: "BR", lat: 25.6093, lng: 85.1376 },
  { name: "Surat", state: "GJ", lat: 21.1702, lng: 72.8311 },
  { name: "Thiruvananthapuram", state: "KL", lat: 8.5241, lng: 76.9366 },
  { name: "Varanasi", state: "UP", lat: 25.3176, lng: 82.9739 },
  { name: "Ranchi", state: "JH", lat: 23.3441, lng: 85.3096 },
  { name: "Guwahati", state: "AS", lat: 26.1445, lng: 91.7362 },
];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateEvents() {
  const events = [];
  const rng = seededRandom(42);

  for (let i = 0; i < 200; i++) {
    const city = cities[Math.floor(rng() * cities.length)];
    const latJitter = (rng() - 0.5) * 0.3;
    const lngJitter = (rng() - 0.5) * 0.3;
    const type = crimeTypes[Math.floor(rng() * crimeTypes.length)];
    const severity = Math.floor(rng() * 5) + 1;
    const daysAgo = Math.floor(rng() * 90);
    const date = new Date(2026, 6, 2);
    date.setDate(date.getDate() - daysAgo);

    const lossRanges = {
      digital_arrest: [50000, 5000000],
      ficn_seizure: [10000, 500000],
      phishing: [5000, 200000],
      investment_fraud: [100000, 10000000],
      upi_fraud: [1000, 100000],
      loan_scam: [20000, 1000000],
    };
    const [minLoss, maxLoss] = lossRanges[type];
    const loss = Math.floor(minLoss + rng() * (maxLoss - minLoss));

    events.push({
      id: `CE-${String(i + 1).padStart(4, '0')}`,
      lat: city.lat + latJitter,
      lng: city.lng + lngJitter,
      type,
      severity,
      city: city.name,
      state: city.state,
      date: date.toISOString().split('T')[0],
      lossAmount: loss,
      source: rng() > 0.5 ? 'ncrb' : 'citizen_report',
    });
  }

  return events;
}

export const crimeEvents = generateEvents();

export const crimeTypeConfig = {
  digital_arrest: { color: '#ef5350', label: 'Digital Arrest Scam', icon: '🚨' },
  ficn_seizure: { color: '#ff9800', label: 'FICN Seizure', icon: '💵' },
  phishing: { color: '#42a5f5', label: 'Phishing', icon: '🎣' },
  investment_fraud: { color: '#ab47bc', label: 'Investment Fraud', icon: '📈' },
  upi_fraud: { color: '#26c6da', label: 'UPI Fraud', icon: '💳' },
  loan_scam: { color: '#8d6e63', label: 'Loan Scam', icon: '🏦' },
};

export const stateStats = [
  { state: "Maharashtra", cases: 42, loss: "₹18.7 Cr", trend: "+12%" },
  { state: "Delhi", cases: 38, loss: "₹15.2 Cr", trend: "+23%" },
  { state: "Karnataka", cases: 28, loss: "₹9.4 Cr", trend: "+8%" },
  { state: "Uttar Pradesh", cases: 35, loss: "₹12.1 Cr", trend: "+31%" },
  { state: "Telangana", cases: 22, loss: "₹7.8 Cr", trend: "+15%" },
  { state: "Tamil Nadu", cases: 19, loss: "₹6.3 Cr", trend: "-5%" },
  { state: "West Bengal", cases: 16, loss: "₹5.1 Cr", trend: "+18%" },
  { state: "Gujarat", cases: 14, loss: "₹4.9 Cr", trend: "+7%" },
];
