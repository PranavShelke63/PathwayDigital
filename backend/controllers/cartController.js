const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get user's cart
exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: 'name price image brand category stock'
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Calculate total price
  let totalPrice = 0;
  for (const item of cart.items) {
    if (item.product) {
      totalPrice += item.product.price * item.quantity;
    }
  }

  // Convert to plain object and ensure proper structure
  const cartObject = cart.toObject();
  
  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        _id: cartObject._id,
        user: cartObject.user,
        items: cartObject.items,
        totalPrice,
        createdAt: cartObject.createdAt,
        updatedAt: cartObject.updatedAt
      }
    }
  });
});

// Add item to cart
exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError('Product ID is required', 400));
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check stock availability
  if (product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(item => 
    item.product._id.toString() === productId
  );

  if (existingItemIndex !== -1) {
    // Update existing item quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (newQuantity > product.stock) {
      return next(new AppError('Insufficient stock', 400));
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity
    });
  }

  await cart.save();

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'name price image brand category stock'
  });

  // Calculate total price
  let totalPrice = 0;
  for (const item of cart.items) {
    if (item.product) {
      totalPrice += item.product.price * item.quantity;
    }
  }

  // Convert to plain object and ensure proper structure
  const cartObject = cart.toObject();

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        _id: cartObject._id,
        user: cartObject.user,
        items: cartObject.items,
        totalPrice,
        createdAt: cartObject.createdAt,
        updatedAt: cartObject.updatedAt
      }
    }
  });
});

// Update cart item quantity
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return next(new AppError('Product ID and quantity are required', 400));
  }

  if (quantity < 1) {
    return next(new AppError('Quantity must be at least 1', 400));
  }

  // Check if product exists and has sufficient stock
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(item => 
    item.product._id.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'name price image brand category stock'
  });

  // Calculate total price
  let totalPrice = 0;
  for (const item of cart.items) {
    if (item.product) {
      totalPrice += item.product.price * item.quantity;
    }
  }

  // Convert to plain object and ensure proper structure
  const cartObject = cart.toObject();

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        _id: cartObject._id,
        user: cartObject.user,
        items: cartObject.items,
        totalPrice,
        createdAt: cartObject.createdAt,
        updatedAt: cartObject.updatedAt
      }
    }
  });
});

// Remove item from cart
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new AppError('Product ID is required', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  // Remove the item
  cart.items = cart.items.filter(item => 
    item.product._id.toString() !== productId
  );

  await cart.save();

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'name price image brand category stock'
  });

  // Calculate total price
  let totalPrice = 0;
  for (const item of cart.items) {
    if (item.product) {
      totalPrice += item.product.price * item.quantity;
    }
  }

  // Convert to plain object and ensure proper structure
  const cartObject = cart.toObject();

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        _id: cartObject._id,
        user: cartObject.user,
        items: cartObject.items,
        totalPrice,
        createdAt: cartObject.createdAt,
        updatedAt: cartObject.updatedAt
      }
    }
  });
});

// Clear cart
exports.clearCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  cart.items = [];
  await cart.save();

  // Convert to plain object and ensure proper structure
  const cartObject = cart.toObject();

  res.status(200).json({
    status: 'success',
    data: {
      cart: {
        _id: cartObject._id,
        user: cartObject.user,
        items: cartObject.items,
        totalPrice: 0,
        createdAt: cartObject.createdAt,
        updatedAt: cartObject.updatedAt
      }
    }
  });
}); 