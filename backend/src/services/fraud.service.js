// TODO: Replace with real Louvain community detection + GraphSAGE node classification
// ML teammate: drop real clustering output here — shape must match exactly below
// Input: csvBuffer (Buffer of uploaded CSV file in PaySim schema)
// Expected CSV columns: step, type, amount, nameOrig, oldbalanceOrg, newbalanceOrig, nameDest, oldbalanceDest, newbalanceDest, isFraud

export const analyseFraud = async (csvBuffer) => {
  // Parse row count as basic signal for now
  const rows = csvBuffer.toString().split('\n')
  const rowCount = rows.length - 1 // subtract header row

  // TODO: Send csvBuffer to ML microservice at process.env.ML_SERVICE_URL
  // const response = await axios.post(`${process.env.ML_SERVICE_URL}/fraud/cluster`, csvBuffer)
  // return response.data

  return {
    clusters: [
      {
        cluster_id: 'C001',
        risk_tier: 'HIGH',
        node_count: 14,
        edge_count: 38,
        risk_score: 0.91,
        nodes: [
          { id: 'ACC_001', type: 'account', risk_score: 0.88, label: 'Mule Account' },
          { id: 'ACC_002', type: 'account', risk_score: 0.76, label: 'Intermediary' },
          { id: 'SIM_001', type: 'sim', risk_score: 0.82, label: 'Burner SIM' },
          { id: 'ACC_003', type: 'account', risk_score: 0.91, label: 'Primary Mule' },
          { id: 'PHN_001', type: 'phone', risk_score: 0.79, label: 'Spoofed Number' },
        ],
        edges: [
          { source: 'ACC_001', target: 'ACC_002', amount: 45000, type: 'TRANSFER', step: 12 },
          { source: 'SIM_001', target: 'ACC_001', amount: 0, type: 'LINKED', step: 1 },
          { source: 'ACC_002', target: 'ACC_003', amount: 38000, type: 'TRANSFER', step: 15 },
          { source: 'PHN_001', target: 'ACC_001', amount: 0, type: 'LINKED', step: 2 },
        ],
      },
      {
        cluster_id: 'C002',
        risk_tier: 'MEDIUM',
        node_count: 7,
        edge_count: 11,
        risk_score: 0.63,
        nodes: [
          { id: 'ACC_010', type: 'account', risk_score: 0.65, label: 'Suspect Account' },
          { id: 'ACC_011', type: 'account', risk_score: 0.58, label: 'Intermediary' },
        ],
        edges: [
          { source: 'ACC_010', target: 'ACC_011', amount: 18000, type: 'TRANSFER', step: 8 },
        ],
      },
      {
        cluster_id: 'C003',
        risk_tier: 'LOW',
        node_count: 4,
        edge_count: 5,
        risk_score: 0.32,
        nodes: [],
        edges: [],
      },
    ],
    total_accounts: rowCount > 0 ? rowCount : 4821,
    flagged_accounts: 143,
    processing_time_ms: Math.floor(800 + Math.random() * 600),
    session_id: `FRAUD_SESSION_${Date.now()}`,
  }
}
