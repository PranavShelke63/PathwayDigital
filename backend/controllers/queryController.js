const Query = require('../models/Query');

// Create new query
exports.createQuery = async (req, res) => {
  try {
    const query = await Query.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        query
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all queries (admin only)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: queries.length,
      data: {
        queries
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 