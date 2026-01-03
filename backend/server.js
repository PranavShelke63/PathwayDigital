require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const { logger, morganMiddleware } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const limiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const queryRoutes = require('./routes/queryRoutes');
const repairJobRoutes = require('./routes/repairJobRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');

const app = express();

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "http://localhost:3000", "http://localhost:5000", "http://192.168.0.102:3000", "http://192.168.0.102:5000", "data:"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: []
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://192.168.0.102:3000', // Your network IP
    'http://192.168.1.100:3000', // Common alternative network IP
    'http://192.168.1.101:3000', // Another common alternative
    'http://10.0.0.100:3000',    // Another common network range
    'http://10.0.0.101:3000',    // Another common network range
    'http://192.168.184.65:3000' // Additional network IP
  ],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Compression
app.use(compression());

// Logging
app.use(morganMiddleware);

// Serve uploads directory as static files with CORS and CORP headers for images
app.use('/uploads', (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://192.168.0.102:3000',
    'http://192.168.1.100:3000',
    'http://192.168.1.101:3000',
    'http://10.0.0.100:3000',
    'http://10.0.0.101:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Test email endpoint
app.get('/api/v1/test-email', async (req, res) => {
  try {
    const sendEmail = require('./utils/email');
    await sendEmail({
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email to verify configuration.'
    });
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/queries', queryRoutes);
app.use('/api/v1/repairs', repairJobRoutes);
app.use('/api/v1/quotations', quotationRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error handling
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Database connection successful!');
})
.catch((err) => {
  logger.error('Database connection error:', err);
  process.exit(1);
});
//s

// Cleanup expired pending registrations and password resets every 5 minutes
setInterval(() => {
  const now = Date.now();
  
  // Clean up expired registrations
  if (global.pendingRegistrations) {
    for (const [email, registration] of global.pendingRegistrations.entries()) {
      // Clean up expired OTP registrations
      if (registration.otpExpires < now) {
        global.pendingRegistrations.delete(email);
        console.log(`Cleaned up expired OTP registration for: ${email}`);
      }
      // Clean up expired verified registrations (30 minutes after verification)
      else if (registration.isVerified && (now - registration.verifiedAt) > 30 * 60 * 1000) {
        global.pendingRegistrations.delete(email);
        console.log(`Cleaned up expired verified registration for: ${email}`);
      }
    }
  }
  
  // Clean up expired password resets
  if (global.pendingPasswordResets) {
    for (const [email, resetData] of global.pendingPasswordResets.entries()) {
      if (resetData.otpExpires < now) {
        global.pendingPasswordResets.delete(email);
        console.log(`Cleaned up expired password reset for: ${email}`);
      }
    }
  }
}, 5 * 60 * 1000); // 5 minutes

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Server accessible at: http://0.0.0.0:${PORT}`);
});