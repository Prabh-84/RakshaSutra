// Analytics data for Chart.js visualizations

export const weeklyTrends = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  scamDetections: [34, 42, 51, 38, 67, 45, 53],
  ficnDetections: [12, 8, 15, 22, 18, 9, 14],
  citizenQueries: [234, 312, 287, 345, 398, 267, 301],
  fraudRingsFound: [1, 0, 2, 1, 3, 0, 1],
};

export const threatCategoryData = {
  labels: [
    'Digital Arrest — CBI',
    'Digital Arrest — ED',
    'Customs Parcel',
    'OTP Phishing',
    'Investment Fraud',
    'Loan App Scam',
    'UPI Fraud',
  ],
  values: [847, 312, 198, 256, 134, 89, 167],
  colors: [
    '#ef5350', '#ff7043', '#ff9800', '#42a5f5',
    '#7c4dff', '#26c6da', '#66bb6a',
  ],
};

export const responseTimeData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  beforeRaksha: [7200, 6800, 7400, 6900, 7100, 6600, 7000], // seconds — hours
  afterRaksha: [45, 42, 38, 35, 30, 28, 22], // seconds — near-instant
};

export const modulePerformance = [
  { module: 'Scam Sentinel', accuracy: 94, latency: 32, throughput: 1200, uptime: 99.97 },
  { module: 'NoteSure', accuracy: 98.2, latency: 1.8, throughput: 850, uptime: 99.95 },
  { module: 'FraudGraph', accuracy: 91, latency: 2400, throughput: 100000, uptime: 99.92 },
  { module: 'CrimeMap', accuracy: 87, latency: 4200, throughput: 500, uptime: 99.98 },
  { module: 'NagrikShield', accuracy: 95, latency: 800, throughput: 2000, uptime: 99.99 },
];

export const impactMetrics = {
  totalScamsBlocked: 12847,
  totalCitizensSaved: 47832,
  totalFICNDetected: 3421,
  financialLossPrevented: 4230000000, // ₹423 Cr
  avgDetectionTime: 22, // seconds
  fraudRingsDisrupted: 156,
  statesCovered: 28,
  languagesSupported: 12,
};

export const monthlyTrend = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  scamCases: [1200, 1450, 1680, 1890, 2340, 2780, 3100],
  blocked: [480, 725, 1008, 1323, 1872, 2502, 2914],
  blockRate: [40, 50, 60, 70, 80, 90, 94],
};

export const fusionCorrelations = [
  {
    id: 'FC-001',
    trigger: 'Scam Sentinel detected active digital arrest — Hyderabad',
    correlation: 'FraudGraph: Caller number part of Ring #1 (Operation VidTrap)',
    action: 'Auto-escalated to National Priority • MHA alerted • Local police dispatched',
    modules: ['Scam Sentinel', 'FraudGraph', 'CrimeMap'],
    severity: 'critical',
    timestamp: '2 min ago',
  },
  {
    id: 'FC-002',
    trigger: 'NoteSure: 7 FICN ₹500 detections in Lucknow District (48h)',
    correlation: 'CrimeMap: Spatial cluster matches Ring #3 territory',
    action: 'District FICN Alert generated • Linked to FICN Distribution Network',
    modules: ['NoteSure', 'CrimeMap', 'FraudGraph'],
    severity: 'high',
    timestamp: '15 min ago',
  },
  {
    id: 'FC-003',
    trigger: 'NagrikShield: 23 citizen reports about +91-11-2301XXXX in 1 hour',
    correlation: 'Scam Sentinel: Number flagged as spoofed government helpline',
    action: 'Auto-blocked via Telecom API • Added to FraudGraph • Advisory pushed',
    modules: ['NagrikShield', 'Scam Sentinel'],
    severity: 'critical',
    timestamp: '38 min ago',
  },
  {
    id: 'FC-004',
    trigger: 'FraudGraph: New money mule account detected (AXIS-XXXX2345)',
    correlation: 'CrimeMap: Account location within 2km of known fraud compound (Noida)',
    action: 'Alert nearest LEA unit • Physical investigation initiated',
    modules: ['FraudGraph', 'CrimeMap'],
    severity: 'high',
    timestamp: '1 hr ago',
  },
  {
    id: 'FC-005',
    trigger: 'CrimeMap: 5x spike in Noida Sector 62 investment fraud complaints',
    correlation: 'FraudGraph: 4 linked accounts identified • NagrikShield: 12 matching citizen queries',
    action: 'Emerging threat alert • Resource reallocation recommended • Patrol route updated',
    modules: ['CrimeMap', 'FraudGraph', 'NagrikShield'],
    severity: 'medium',
    timestamp: '2 hr ago',
  },
];

export const architectureLayers = [
  {
    name: 'Data Ingestion',
    color: '#42a5f5',
    components: [
      { name: 'Telecom CDR Feed', tech: 'Kafka Connect', status: 'active' },
      { name: 'Banking Transaction Stream', tech: 'Kafka Streams', status: 'active' },
      { name: 'NCRB Complaint API', tech: 'REST/gRPC', status: 'active' },
      { name: 'Citizen Input', tech: 'WhatsApp Business API', status: 'active' },
      { name: 'Camera/Scanner Feed', tech: 'Edge SDK', status: 'active' },
    ],
  },
  {
    name: 'AI/ML Engine',
    color: '#7c4dff',
    components: [
      { name: 'Scam Sentinel', tech: 'IndicBERT + RawNet3 + XGBoost', status: 'active' },
      { name: 'NoteSure', tech: 'EfficientNet + YOLOv8 + ESRGAN', status: 'active' },
      { name: 'FraudGraph', tech: 'GAT + GraphSAGE + Neo4j', status: 'active' },
      { name: 'CrimeMap', tech: 'XGBoost + PySAL + PostGIS', status: 'active' },
      { name: 'NagrikShield', tech: 'Gemini API + Rasa + IndicWhisper', status: 'active' },
      { name: 'Intelligence Fusion', tech: 'Cross-module Correlation Engine', status: 'active' },
    ],
  },
  {
    name: 'Data & Storage',
    color: '#26c6da',
    components: [
      { name: 'PostgreSQL', tech: 'Relational + PostGIS', status: 'active' },
      { name: 'Neo4j', tech: 'Graph Database', status: 'active' },
      { name: 'Elasticsearch', tech: 'Search & Analytics', status: 'active' },
      { name: 'Redis', tech: 'Cache + Pub/Sub', status: 'active' },
      { name: 'MinIO/S3', tech: 'Object Storage', status: 'active' },
      { name: 'TimescaleDB', tech: 'Time-series', status: 'active' },
    ],
  },
  {
    name: 'Application Layer',
    color: '#ff9800',
    components: [
      { name: 'API Gateway', tech: 'Kong / Nginx', status: 'active' },
      { name: 'Command Centre', tech: 'React + D3 + Chart.js', status: 'active' },
      { name: 'Mobile Apps', tech: 'React Native', status: 'planned' },
      { name: 'WhatsApp Bot', tech: 'WhatsApp Business API', status: 'active' },
      { name: 'IVR Gateway', tech: 'Twilio / Exotel', status: 'planned' },
      { name: 'Telecom API', tech: 'REST + gRPC', status: 'active' },
    ],
  },
  {
    name: 'Infrastructure',
    color: '#ef5350',
    components: [
      { name: 'Kubernetes', tech: 'Container Orchestration', status: 'active' },
      { name: 'Prometheus + Grafana', tech: 'Monitoring', status: 'active' },
      { name: 'ELK Stack', tech: 'Logging', status: 'active' },
      { name: 'HashiCorp Vault', tech: 'Secrets Management', status: 'active' },
      { name: 'GPU Pool (A100/T4)', tech: 'ML Inference', status: 'active' },
    ],
  },
];
