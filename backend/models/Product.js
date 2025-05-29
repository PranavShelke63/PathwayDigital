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
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'A product must belong to a category'],
    enum: {
      values: ['laptops', 'desktops', 'components', 'accessories', 'monitors', 'networking'],
      message: 'Category is either: laptops, desktops, components, accessories, monitors, networking'
    }
  },
  brand: {
    type: String,
    required: [true, 'A product must have a brand'],
    trim: true
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
  specifications: {
    processor: String,
    ram: String,
    storage: String,
    graphics: String,
    display: String,
    operatingSystem: String,
    connectivity: [String],
    ports: [String],
    battery: String,
    dimensions: String,
    weight: String
  },
  features: [String],
  warranty: {
    type: String,
    required: [true, 'A product must have warranty information']
  },
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