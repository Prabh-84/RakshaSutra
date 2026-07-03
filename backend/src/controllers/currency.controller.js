import { analyseCurrency } from '../services/currency.service.js'

export const analyseImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided. Send a JPG or PNG as form-data field "image".' })
    }

    const result = await analyseCurrency(req.file.buffer, req.file.mimetype)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
