// controllers/accreditationStorage.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'public/uploads/accreditations';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}-${cleanName}`);
  }
});

exports.uploadAccreditation = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 2 // Allow both PDF and thumbnail
    },
    fileFilter: (req, file, cb) => {
      if (
        (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') ||
        (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/'))
      ) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`), false);
      }
    }
  }).fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]);