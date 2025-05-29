const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Order item must belong to a product']
  },
  quantity: {
    type: Number,
    required: [true, 'Order item must have a quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Order item must have a price']
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: [true, 'Order must have a total amount']
  },
  status: {
    type: String,
    required: [true, 'Order must have a status'],
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Status is either: pending, processing, shipped, delivered, cancelled'
    },
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide zip code']
    },
    country: {
      type: String,
      required: [true, 'Please provide country']
    }
  },
  paymentMethod: {
    type: String,
    required: [true, 'Order must have a payment method'],
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
      message: 'Payment method is either: credit_card, debit_card, paypal, cash_on_delivery'
    }
  },
  paymentStatus: {
    type: String,
    required: [true, 'Order must have a payment status'],
    enum: {
      values: ['pending', 'completed', 'failed', 'refunded'],
      message: 'Payment status is either: pending, completed, failed, refunded'
    },
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Populate user and product details when querying
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'items.product',
    select: 'name price'
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 