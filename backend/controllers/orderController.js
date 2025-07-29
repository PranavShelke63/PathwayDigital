const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create new order
exports.createOrder = catchAsync(async (req, res, next) => {
  const { items, totalAmount, shippingAddress, paymentMethod, paymentStatus = 'pending' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError('Order must contain at least one item', 400));
  }

  if (!totalAmount || totalAmount <= 0) {
    return next(new AppError('Invalid total amount', 400));
  }

  if (!shippingAddress) {
    return next(new AppError('Shipping address is required', 400));
  }

  // Validate payment method
  const validPaymentMethods = ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return next(new AppError('Invalid payment method', 400));
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    status: 'pending'
  });

  // Clear user's cart after successful order
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [] }
  );

  // Populate order details
  await order.populate({
    path: 'user',
    select: 'name email'
  });
  await order.populate({
    path: 'items.product',
    select: 'name price image'
  });

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get user's orders
exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate({
      path: 'items.product',
      select: 'name price image'
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// Get single order
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.product',
      select: 'name price image'
    });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if user owns this order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Update order status (admin only)
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.email !== 'pranavopshelke@gmail.com') {
    return next(new AppError('Not authorized to update orders', 403));
  }

  const { status, paymentStatus } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

  if (status && !validStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    return next(new AppError('Invalid payment status', 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, paymentStatus },
    { new: true, runValidators: true }
  ).populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'items.product',
    select: 'name price image'
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get all orders (admin only)
exports.getAllOrders = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.email !== 'pranavopshelke@gmail.com') {
    return next(new AppError('Not authorized to view all orders', 403));
  }

  const orders = await Order.find()
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.product',
      select: 'name price image'
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

// Delete order (admin only)
exports.deleteOrder = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.email !== 'pranavopshelke@gmail.com') {
    return next(new AppError('Not authorized to delete orders', 403));
  }

  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Order deleted successfully'
  });
}); 