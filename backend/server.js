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
const path = require('path');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Serve uploads directory with CORS for static files
app.use('/uploads', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}), express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/queries', queryRoutes);
app.use('/api/v1/repairs', repairJobRoutes);
app.use('/api/v1/quotations', quotationRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});