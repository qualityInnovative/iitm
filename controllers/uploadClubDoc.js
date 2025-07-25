const multer = require('multer');
const fs = require('fs');
const path = require('path');
const clubStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = 'public/uploads/clubs';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const cleanName = file.originalname.replace(/[^a-z0-9\.]/gi, '_');
      cb(null, uniqueSuffix + '-' + cleanName);
    }
  });
  
  exports.uploadClubDoc = multer({ 
    storage: clubStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    }
  }).single('pdf');