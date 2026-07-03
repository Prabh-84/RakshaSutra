// Synthetic fraud network data for D3.js force-directed graph
export const fraudNetworkNodes = [
  // Fraud Ring 1 — Digital Arrest Operation (red cluster)
  { id: "P001", label: "Rajan Mehra", type: "person", role: "operator", riskScore: 0.96, cluster: 1 },
  { id: "P002", label: "Vikram Singh", type: "person", role: "operator", riskScore: 0.94, cluster: 1 },
  { id: "P003", label: "Unknown M1", type: "person", role: "mule", riskScore: 0.88, cluster: 1 },
  { id: "P004", label: "Unknown M2", type: "person", role: "mule", riskScore: 0.85, cluster: 1 },
  { id: "PH001", label: "+91-887XXXXXX", type: "phone", riskScore: 0.97, cluster: 1 },
  { id: "PH002", label: "+91-776XXXXXX", type: "phone", riskScore: 0.95, cluster: 1 },
  { id: "PH003", label: "+91-881XXXXXX", type: "phone", riskScore: 0.93, cluster: 1 },
  { id: "PH004", label: "+91-994XXXXXX", type: "phone", riskScore: 0.70, cluster: 1 },
  { id: "BA001", label: "HDFC-XXXX4523", type: "account", riskScore: 0.92, cluster: 1 },
  { id: "BA002", label: "SBI-XXXX8901", type: "account", riskScore: 0.89, cluster: 1 },
  { id: "BA003", label: "PNB-XXXX3456", type: "account", riskScore: 0.87, cluster: 1 },
  { id: "D001", label: "IMEI:35298XXXX", type: "device", riskScore: 0.91, cluster: 1 },
  { id: "D002", label: "IMEI:86754XXXX", type: "device", riskScore: 0.88, cluster: 1 },

  // Fraud Ring 2 — Investment Scam (purple cluster)
  { id: "P005", label: "Ajay Kumar", type: "person", role: "operator", riskScore: 0.91, cluster: 2 },
  { id: "P006", label: "Neha Gupta", type: "person", role: "recruiter", riskScore: 0.82, cluster: 2 },
  { id: "P007", label: "Unknown M3", type: "person", role: "mule", riskScore: 0.79, cluster: 2 },
  { id: "P008", label: "Unknown M4", type: "person", role: "mule", riskScore: 0.76, cluster: 2 },
  { id: "PH005", label: "+91-665XXXXXX", type: "phone", riskScore: 0.86, cluster: 2 },
  { id: "PH006", label: "+91-778XXXXXX", type: "phone", riskScore: 0.83, cluster: 2 },
  { id: "BA004", label: "ICICI-XXXX7890", type: "account", riskScore: 0.88, cluster: 2 },
  { id: "BA005", label: "AXIS-XXXX2345", type: "account", riskScore: 0.84, cluster: 2 },
  { id: "BA006", label: "BOB-XXXX6789", type: "account", riskScore: 0.81, cluster: 2 },
  { id: "D003", label: "IP:103.21.XX.XX", type: "device", riskScore: 0.85, cluster: 2 },

  // Fraud Ring 3 — FICN Distribution (orange cluster)
  { id: "P009", label: "Suresh Yadav", type: "person", role: "operator", riskScore: 0.93, cluster: 3 },
  { id: "P010", label: "Mohammad Ali", type: "person", role: "operator", riskScore: 0.90, cluster: 3 },
  { id: "P011", label: "Unknown M5", type: "person", role: "mule", riskScore: 0.74, cluster: 3 },
  { id: "PH007", label: "+91-556XXXXXX", type: "phone", riskScore: 0.80, cluster: 3 },
  { id: "PH008", label: "+91-443XXXXXX", type: "phone", riskScore: 0.77, cluster: 3 },
  { id: "BA007", label: "UBI-XXXX1234", type: "account", riskScore: 0.82, cluster: 3 },
  { id: "D004", label: "IMEI:99012XXXX", type: "device", riskScore: 0.78, cluster: 3 },
  { id: "L001", label: "Lucknow, UP", type: "location", riskScore: 0.75, cluster: 3 },

  // Victims (grey, unconnected to each other)
  { id: "V001", label: "Victim-Mumbai", type: "victim", riskScore: 0, cluster: 0 },
  { id: "V002", label: "Victim-Bengaluru", type: "victim", riskScore: 0, cluster: 0 },
  { id: "V003", label: "Victim-Delhi", type: "victim", riskScore: 0, cluster: 0 },
  { id: "V004", label: "Victim-Hyderabad", type: "victim", riskScore: 0, cluster: 0 },
  { id: "V005", label: "Victim-Chennai", type: "victim", riskScore: 0, cluster: 0 },

  // Complaints
  { id: "C001", label: "FIR-MH-2026-847", type: "complaint", riskScore: 0, cluster: 0 },
  { id: "C002", label: "FIR-KA-2026-848", type: "complaint", riskScore: 0, cluster: 0 },
  { id: "C003", label: "FIR-DL-2026-132", type: "complaint", riskScore: 0, cluster: 0 },
];

export const fraudNetworkEdges = [
  // Ring 1 connections
  { source: "P001", target: "PH001", type: "OWNS" },
  { source: "P001", target: "PH003", type: "OWNS" },
  { source: "P002", target: "PH002", type: "OWNS" },
  { source: "P003", target: "BA001", type: "OWNS" },
  { source: "P004", target: "BA002", type: "OWNS" },
  { source: "P004", target: "BA003", type: "OWNS" },
  { source: "P001", target: "D001", type: "USED_DEVICE" },
  { source: "P002", target: "D002", type: "USED_DEVICE" },
  { source: "PH001", target: "PH004", type: "CALLED", value: 47 },
  { source: "PH002", target: "PH001", type: "CALLED", value: 32 },
  { source: "PH003", target: "PH002", type: "CALLED", value: 18 },
  { source: "BA001", target: "BA002", type: "TRANSFERRED", value: 250000 },
  { source: "BA002", target: "BA003", type: "TRANSFERRED", value: 180000 },
  { source: "P001", target: "P002", type: "ASSOCIATED" },
  { source: "P001", target: "P003", type: "ASSOCIATED" },
  { source: "P002", target: "P004", type: "ASSOCIATED" },

  // Ring 2 connections
  { source: "P005", target: "PH005", type: "OWNS" },
  { source: "P006", target: "PH006", type: "OWNS" },
  { source: "P007", target: "BA004", type: "OWNS" },
  { source: "P008", target: "BA005", type: "OWNS" },
  { source: "P005", target: "BA006", type: "OWNS" },
  { source: "P005", target: "D003", type: "USED_DEVICE" },
  { source: "PH005", target: "PH006", type: "CALLED", value: 55 },
  { source: "BA004", target: "BA005", type: "TRANSFERRED", value: 500000 },
  { source: "BA005", target: "BA006", type: "TRANSFERRED", value: 320000 },
  { source: "P005", target: "P006", type: "ASSOCIATED" },
  { source: "P006", target: "P007", type: "ASSOCIATED" },
  { source: "P007", target: "P008", type: "ASSOCIATED" },

  // Ring 3 connections
  { source: "P009", target: "PH007", type: "OWNS" },
  { source: "P010", target: "PH008", type: "OWNS" },
  { source: "P011", target: "BA007", type: "OWNS" },
  { source: "P009", target: "D004", type: "USED_DEVICE" },
  { source: "PH007", target: "PH008", type: "CALLED", value: 28 },
  { source: "P009", target: "L001", type: "LOCATED_AT" },
  { source: "P010", target: "L001", type: "LOCATED_AT" },
  { source: "P009", target: "P010", type: "ASSOCIATED" },
  { source: "P010", target: "P011", type: "ASSOCIATED" },

  // Cross-ring connection (linking Ring 1 and Ring 2)
  { source: "BA003", target: "BA004", type: "TRANSFERRED", value: 150000 },

  // Victim connections
  { source: "V001", target: "C001", type: "FILED" },
  { source: "V002", target: "C002", type: "FILED" },
  { source: "V003", target: "C003", type: "FILED" },
  { source: "C001", target: "PH001", type: "LINKED_TO" },
  { source: "C002", target: "PH002", type: "LINKED_TO" },
  { source: "C003", target: "PH005", type: "LINKED_TO" },
  { source: "PH001", target: "V004", type: "CALLED", value: 3 },
  { source: "PH003", target: "V005", type: "CALLED", value: 2 },
];

export const nodeTypeConfig = {
  person: { color: "#ef5350", icon: "👤", label: "Person" },
  phone: { color: "#42a5f5", icon: "📱", label: "Phone" },
  account: { color: "#66bb6a", icon: "🏦", label: "Bank Account" },
  device: { color: "#ffa726", icon: "💻", label: "Device" },
  location: { color: "#ab47bc", icon: "📍", label: "Location" },
  victim: { color: "#78909c", icon: "🛡️", label: "Victim" },
  complaint: { color: "#8d6e63", icon: "📋", label: "Complaint" },
};

export const clusterInfo = [
  {
    id: 1,
    name: "Digital Arrest Ring — Operation VidTrap",
    type: "digital_arrest",
    suspects: 4,
    victims: 247,
    estimatedLoss: "₹4.23 Cr",
    jurisdictions: ["Maharashtra", "Delhi", "Karnataka", "Telangana"],
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Investment Scam Ring — StockPro Fraud",
    type: "investment_fraud",
    suspects: 4,
    victims: 89,
    estimatedLoss: "₹1.87 Cr",
    jurisdictions: ["Delhi", "Uttar Pradesh"],
    status: "UNDER_INVESTIGATION",
  },
  {
    id: 3,
    name: "FICN Distribution Network — Lucknow Cell",
    type: "ficn_distribution",
    suspects: 3,
    victims: 0,
    estimatedLoss: "₹32 Lakh (face value)",
    jurisdictions: ["Uttar Pradesh", "Bihar"],
    status: "PARTIALLY_DISRUPTED",
  },
];
