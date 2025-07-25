const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'A product must have a brand'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A product must belong to a category']
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'A product must have an image']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'A product must have stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  warranty: {
    type: String,
    required: [true, 'A product must have warranty information']
  },
  specifications: {
    type: Object,
    default: {}
  },
  features: [String],
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above 0'],
    max: [5, 'Rating must be below 5'],
    set: (val) => Math.round(val * 10) / 10
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 