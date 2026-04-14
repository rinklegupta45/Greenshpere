const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  storage = multer.memoryStorage();
} else {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + (file.originalname || 'image').replace(/\s/g, '-')),
  });
}

const upload = multer({ storage });
exports.uploadSingle = upload.single('image');
exports.uploadAvatar = upload.single('avatar');
