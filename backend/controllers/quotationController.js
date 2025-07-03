const Quotation = require('../models/Quotation');

// Create new quotation
exports.createQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { quotation }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all quotations (admin only)
exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: quotations.length,
      data: { quotations }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 