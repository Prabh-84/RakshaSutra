// TODO: Replace with ONNX model inference when ML teammate is ready
// ML teammate: load model from process.env.ML_SERVICE_URL or run ONNX Runtime here
// Input: imageBuffer (Buffer), mimetype (string)
// Output: must match the shape below exactly

export const analyseCurrency = async (imageBuffer, mimetype) => {
  // Stub — hardcoded response matching the real production output shape
  // When real model is ready, replace this return with actual inference
  const verdicts = ['suspect', 'genuine']
  const verdict = verdicts[Math.random() > 0.3 ? 0 : 1] // 70% suspect for demo

  return {
    verdict,
    confidence: parseFloat((0.85 + Math.random() * 0.12).toFixed(2)),
    denomination: 500,
    flagged_regions: verdict === 'suspect'
      ? [
          { label: 'Security Thread', x: 120, y: 45, w: 10, h: 200 },
          { label: 'Microprint Zone', x: 340, y: 180, w: 60, h: 20 },
          { label: 'UV Luminescence', x: 80, y: 220, w: 40, h: 40 },
        ]
      : [],
    gradcam_url: null, // TODO: return GradCAM heatmap URL from model
    scan_id: `SCAN_${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
}
