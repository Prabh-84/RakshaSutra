import { analyseFraud } from '../services/fraud.service.js'

export const analyseCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file provided. Send a CSV as form-data field "file".' })
    }

    const result = await analyseFraud(req.file.buffer)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
