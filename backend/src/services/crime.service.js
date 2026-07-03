// Static crime event data — calibrated from NCRB 2023 state-level report
// Real NCRB point-level geocoordinates are not public.
// City centroids used as approximate event locations.
// Maharashtra, UP, Telangana are top 3 states per NCRB 2023 cybercrime data.

export const crimeEvents = [
  // Maharashtra
  { id: 'EVT_001', lat: 19.076, lng: 72.877, type: 'UPI_Fraud', severity: 'HIGH', city: 'Mumbai', state: 'Maharashtra', loss_amount: 85000, timestamp: '2024-11-15T14:30:00Z', fir_number: 'FIR/2024/MH/00412' },
  { id: 'EVT_002', lat: 18.520, lng: 73.856, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'Pune', state: 'Maharashtra', loss_amount: 520000, timestamp: '2024-11-18T10:00:00Z', fir_number: 'FIR/2024/MH/00531' },
  { id: 'EVT_003', lat: 19.997, lng: 73.790, type: 'OTP_Phishing', severity: 'MEDIUM', city: 'Nashik', state: 'Maharashtra', loss_amount: 32000, timestamp: '2024-11-25T09:20:00Z', fir_number: 'FIR/2024/MH/00278' },
  { id: 'EVT_004', lat: 21.145, lng: 79.088, type: 'Loan_App_Scam', severity: 'HIGH', city: 'Nagpur', state: 'Maharashtra', loss_amount: 65000, timestamp: '2024-12-02T15:45:00Z', fir_number: 'FIR/2024/MH/00602' },

  // Delhi/NCR
  { id: 'EVT_005', lat: 28.613, lng: 77.209, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'New Delhi', state: 'Delhi', loss_amount: 340000, timestamp: '2024-11-20T09:15:00Z', fir_number: 'FIR/2024/DL/00891' },
  { id: 'EVT_006', lat: 28.450, lng: 77.026, type: 'Investment_Fraud', severity: 'HIGH', city: 'Gurugram', state: 'Haryana', loss_amount: 180000, timestamp: '2024-11-28T11:30:00Z', fir_number: 'FIR/2024/HR/00445' },
  { id: 'EVT_007', lat: 28.535, lng: 77.391, type: 'UPI_Fraud', severity: 'MEDIUM', city: 'Noida', state: 'Uttar Pradesh', loss_amount: 41000, timestamp: '2024-12-03T08:50:00Z', fir_number: 'FIR/2024/UP/00923' },

  // Telangana / Andhra Pradesh
  { id: 'EVT_008', lat: 17.385, lng: 78.486, type: 'OTP_Phishing', severity: 'MEDIUM', city: 'Hyderabad', state: 'Telangana', loss_amount: 42000, timestamp: '2024-12-01T16:45:00Z', fir_number: 'FIR/2024/TS/00234' },
  { id: 'EVT_009', lat: 16.506, lng: 80.648, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'Vijayawada', state: 'Andhra Pradesh', loss_amount: 290000, timestamp: '2024-12-08T13:10:00Z', fir_number: 'FIR/2024/AP/00187' },

  // Karnataka
  { id: 'EVT_010', lat: 12.971, lng: 77.594, type: 'FICN_Circulation', severity: 'HIGH', city: 'Bengaluru', state: 'Karnataka', loss_amount: 0, timestamp: '2024-12-05T11:20:00Z', fir_number: 'FIR/2024/KA/00567' },
  { id: 'EVT_011', lat: 12.971, lng: 77.594, type: 'Investment_Fraud', severity: 'HIGH', city: 'Bengaluru', state: 'Karnataka', loss_amount: 230000, timestamp: '2024-12-12T09:45:00Z', fir_number: 'FIR/2024/KA/00612' },

  // West Bengal
  { id: 'EVT_012', lat: 22.572, lng: 88.363, type: 'UPI_Fraud', severity: 'HIGH', city: 'Kolkata', state: 'West Bengal', loss_amount: 125000, timestamp: '2024-12-10T08:30:00Z', fir_number: 'FIR/2024/WB/00123' },
  { id: 'EVT_013', lat: 22.572, lng: 88.363, type: 'FICN_Circulation', severity: 'CRITICAL', city: 'Kolkata', state: 'West Bengal', loss_amount: 0, timestamp: '2024-12-14T14:00:00Z', fir_number: 'FIR/2024/WB/00198' },

  // Tamil Nadu
  { id: 'EVT_014', lat: 13.083, lng: 80.270, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'Chennai', state: 'Tamil Nadu', loss_amount: 410000, timestamp: '2024-11-22T10:30:00Z', fir_number: 'FIR/2024/TN/00344' },
  { id: 'EVT_015', lat: 11.127, lng: 77.343, type: 'Loan_App_Scam', severity: 'MEDIUM', city: 'Coimbatore', state: 'Tamil Nadu', loss_amount: 28000, timestamp: '2024-12-06T12:15:00Z', fir_number: 'FIR/2024/TN/00512' },

  // Rajasthan
  { id: 'EVT_016', lat: 26.912, lng: 75.787, type: 'Investment_Fraud', severity: 'HIGH', city: 'Jaipur', state: 'Rajasthan', loss_amount: 175000, timestamp: '2024-11-30T16:00:00Z', fir_number: 'FIR/2024/RJ/00267' },
  { id: 'EVT_017', lat: 24.585, lng: 73.712, type: 'OTP_Phishing', severity: 'MEDIUM', city: 'Udaipur', state: 'Rajasthan', loss_amount: 22000, timestamp: '2024-12-09T10:40:00Z', fir_number: 'FIR/2024/RJ/00311' },

  // Uttar Pradesh
  { id: 'EVT_018', lat: 26.846, lng: 80.946, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'Lucknow', state: 'Uttar Pradesh', loss_amount: 680000, timestamp: '2024-11-17T09:00:00Z', fir_number: 'FIR/2024/UP/00456' },
  { id: 'EVT_019', lat: 25.594, lng: 85.137, type: 'UPI_Fraud', severity: 'HIGH', city: 'Patna', state: 'Bihar', loss_amount: 95000, timestamp: '2024-12-04T14:30:00Z', fir_number: 'FIR/2024/BR/00189' },
  { id: 'EVT_020', lat: 27.176, lng: 78.008, type: 'Loan_App_Scam', severity: 'HIGH', city: 'Agra', state: 'Uttar Pradesh', loss_amount: 58000, timestamp: '2024-12-11T11:00:00Z', fir_number: 'FIR/2024/UP/00678' },

  // Gujarat
  { id: 'EVT_021', lat: 23.022, lng: 72.571, type: 'Investment_Fraud', severity: 'HIGH', city: 'Ahmedabad', state: 'Gujarat', loss_amount: 320000, timestamp: '2024-11-26T15:20:00Z', fir_number: 'FIR/2024/GJ/00234' },
  { id: 'EVT_022', lat: 21.170, lng: 72.831, type: 'FICN_Circulation', severity: 'HIGH', city: 'Surat', state: 'Gujarat', loss_amount: 0, timestamp: '2024-12-07T08:45:00Z', fir_number: 'FIR/2024/GJ/00412' },

  // Madhya Pradesh
  { id: 'EVT_023', lat: 23.259, lng: 77.412, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'Bhopal', state: 'Madhya Pradesh', loss_amount: 450000, timestamp: '2024-11-21T12:00:00Z', fir_number: 'FIR/2024/MP/00198' },
  { id: 'EVT_024', lat: 22.719, lng: 75.857, type: 'OTP_Phishing', severity: 'MEDIUM', city: 'Indore', state: 'Madhya Pradesh', loss_amount: 37000, timestamp: '2024-12-13T09:30:00Z', fir_number: 'FIR/2024/MP/00334' },

  // Punjab / Chandigarh
  { id: 'EVT_025', lat: 30.733, lng: 76.779, type: 'Investment_Fraud', severity: 'HIGH', city: 'Chandigarh', state: 'Punjab', loss_amount: 195000, timestamp: '2024-11-29T14:45:00Z', fir_number: 'FIR/2024/PB/00156' },

  // Odisha
  { id: 'EVT_026', lat: 20.296, lng: 85.824, type: 'UPI_Fraud', severity: 'MEDIUM', city: 'Bhubaneswar', state: 'Odisha', loss_amount: 48000, timestamp: '2024-12-16T10:20:00Z', fir_number: 'FIR/2024/OD/00089' },

  // Assam
  { id: 'EVT_027', lat: 26.144, lng: 91.736, type: 'Loan_App_Scam', severity: 'HIGH', city: 'Guwahati', state: 'Assam', loss_amount: 72000, timestamp: '2024-12-18T13:00:00Z', fir_number: 'FIR/2024/AS/00067' },

  // Kerala
  { id: 'EVT_028', lat: 8.524, lng: 76.936, type: 'Investment_Fraud', severity: 'HIGH', city: 'Thiruvananthapuram', state: 'Kerala', loss_amount: 140000, timestamp: '2024-12-19T11:30:00Z', fir_number: 'FIR/2024/KL/00213' },
  { id: 'EVT_029', lat: 10.527, lng: 76.213, type: 'Digital_Arrest', severity: 'CRITICAL', city: 'Thrissur', state: 'Kerala', loss_amount: 380000, timestamp: '2024-12-20T09:00:00Z', fir_number: 'FIR/2024/KL/00298' },

  // Jharkhand
  { id: 'EVT_030', lat: 23.610, lng: 85.279, type: 'UPI_Fraud', severity: 'HIGH', city: 'Ranchi', state: 'Jharkhand', loss_amount: 89000, timestamp: '2024-12-21T15:00:00Z', fir_number: 'FIR/2024/JH/00145' },
]

// TODO: Replace with real NCRB API or PostGIS database query
// Filters: state, type, severity
export const getCrimeEvents = async (filters = {}) => {
  let filtered = [...crimeEvents]

  if (filters.state) {
    filtered = filtered.filter(e => e.state.toLowerCase() === filters.state.toLowerCase())
  }
  if (filters.type) {
    filtered = filtered.filter(e => e.type.toLowerCase() === filters.type.toLowerCase())
  }
  if (filters.severity) {
    filtered = filtered.filter(e => e.severity.toLowerCase() === filters.severity.toLowerCase())
  }

  return {
    events: filtered,
    total: crimeEvents.length,
    filtered: filtered.length,
  }
}
