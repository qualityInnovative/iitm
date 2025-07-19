// Add this with your other multer storage configurations
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const orgChartStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "public/uploads/org-charts";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const cleanName = file.originalname.replace(/[^a-z0-9\.]/gi, '_');
        cb(null, uniqueSuffix + '-' + cleanName);
    }
});

exports.uploadOrgChart = multer({
    storage: orgChartStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
}).single('image');