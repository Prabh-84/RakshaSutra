import { getCrimeEvents } from '../services/crime.service.js'

export const getEvents = async (req, res, next) => {
  try {
    const { state, type, severity } = req.query
    const result = await getCrimeEvents({ state, type, severity })
    res.json(result)
  } catch (err) {
    next(err)
  }
}
