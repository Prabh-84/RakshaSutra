import multer from 'multer'

const storage = multer.memoryStorage()

// Image upload — for /currency/analyse (JPG/PNG, max 10MB)
export const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG and PNG images are supported'))
    }
  },
}).single('image')

// CSV upload — for /fraud/analyse (CSV, max 50MB)
export const uploadCSV = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true)
    } else {
      cb(new Error('Only CSV files are supported'))
    }
  },
}).single('file')
