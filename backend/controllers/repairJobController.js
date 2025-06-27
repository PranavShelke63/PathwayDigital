const RepairJob = require('../models/RepairJob');
const path = require('path');
const multer = require('multer');

// Create a new repair job
exports.createRepairJob = async (req, res) => {
  try {
    const job = await RepairJob.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all repair jobs (with optional filters)
exports.getRepairJobs = async (req, res) => {
  try {
    const { status, customerName, startDate, endDate } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (customerName) filter.customerName = { $regex: customerName, $options: 'i' };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const jobs = await RepairJob.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single repair job by ID
exports.getRepairJobById = async (req, res) => {
  try {
    const job = await RepairJob.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a repair job
exports.updateRepairJob = async (req, res) => {
  try {
    const job = await RepairJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a repair job
exports.deleteRepairJob = async (req, res) => {
  try {
    const job = await RepairJob.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Multer setup for physical condition images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/repair-conditions'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  limits: { files: 8 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  }
});

exports.uploadConditionImages = [
  upload.array('images', 8),
  (req, res) => {
    if (!req.files) return res.status(400).json({ success: false, message: 'No files uploaded' });
    const urls = req.files.map(f => `/uploads/repair-conditions/${f.filename}`);
    res.json({ success: true, urls });
  }
]; 