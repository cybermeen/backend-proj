const multer = require('multer');
const path = require('path');
const fs = require('fs');

//three levels up from src/utils/ to reach the project root, then into public/products
const uploadDir = path.join(__dirname, '../../public/products');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${extension}`);
  },
});

function fileFilter(req, file, cb) {
  console.log('Uploaded file mimetype:', file.mimetype, '| original name:', file.originalname);

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const extension = path.extname(file.originalname).toLowerCase();

  const mimeTypeIsKnownImage = allowedMimeTypes.includes(file.mimetype);
  const extensionLooksLikeImage = allowedExtensions.includes(extension);

  // Accept if EITHER check passes: a properly declared image mimetype,
  // OR a generic/unknown mimetype paired with a recognizable image extension.
  // We still reject anything where NEITHER check passes (e.g. a .pdf that
  // also happens to arrive as application/octet-stream).
  if (mimeTypeIsKnownImage || (file.mimetype === 'application/octet-stream' && extensionLooksLikeImage)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'), false);
  }
}
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
});

module.exports = upload;