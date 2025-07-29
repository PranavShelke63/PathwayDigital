const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Cart item must belong to a product']
  },
  quantity: {
    type: Number,
    required: [true, 'Cart item must have a quantity'],
    min: [1, 'Quantity must be at least 1']
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Cart must belong to a user']
  },
  items: [cartItemSchema],
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Populate product details when querying
cartSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.product',
    select: 'name price image brand category stock'
  });
  next();
});

// Update lastModified timestamp on save
cartSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 