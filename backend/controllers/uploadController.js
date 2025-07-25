const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config: always upload to temp folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'temp');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

exports.uploadImage = [
  upload.single('image'),
  (req, res) => {
    // Debug log
    console.log('UPLOAD DEBUG:', {
      brand: req.body.brand,
      category: req.body.category,
      productName: req.body.productName
    });
    const { brand, category, productName } = req.body;
    const finalDir = path.join(
      __dirname,
      '..',
      'uploads',
      brand || 'UnknownBrand',
      category || 'UnknownCategory',
      productName || 'UnknownProduct'
    );
    fs.mkdirSync(finalDir, { recursive: true });
    const oldPath = req.file.path;
    const newPath = path.join(finalDir, req.file.filename);
    fs.renameSync(oldPath, newPath);
    const relativePath = path.join(
      'uploads',
      brand || 'UnknownBrand',
      category || 'UnknownCategory',
      productName || 'UnknownProduct',
      req.file.filename
    ).replace(/\\/g, '/');
    res.json({ data: { url: relativePath } });
  },
];

exports.deleteImage = (req, res) => {
  const { imagePath } = req.body; // e.g., 'uploads/Brand/Category/ProductName/filename.jpg'
  const fullPath = path.join(__dirname, '..', imagePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json({ message: 'Image deleted' });
  });
}; 