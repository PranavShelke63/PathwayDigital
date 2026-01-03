# MERN Stack Backend Structure Guide

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Core Technologies](#core-technologies)
4. [Server Configuration](#server-configuration)
5. [Database Models](#database-models)
6. [Controllers](#controllers)
7. [Routes](#routes)
8. [Middleware](#middleware)
9. [Utilities](#utilities)
10. [Security Features](#security-features)
11. [API Endpoints](#api-endpoints)
12. [Key Functions & Concepts](#key-functions--concepts)

## Overview

This is a comprehensive MERN (MongoDB, Express.js, React.js, Node.js) stack backend for an organic shop/e-commerce application. The backend provides RESTful API endpoints for user authentication, product management, order processing, cart functionality, and more.

## Project Structure

```
backend/
├── server.js              # Main server entry point
├── package.json           # Dependencies and scripts
├── models/               # MongoDB/Mongoose schemas
├── controllers/          # Business logic handlers
├── routes/              # API route definitions
├── middleware/          # Custom middleware functions
├── utils/               # Utility functions
├── uploads/             # File upload directory
├── seeds/               # Database seeding scripts
└── logs/                # Application logs
```

## Core Technologies

### Dependencies
- **Express.js** (^4.18.2) - Web framework for Node.js
- **Mongoose** (^8.0.3) - MongoDB object modeling tool
- **bcryptjs** (^2.4.3) - Password hashing
- **jsonwebtoken** (^9.0.2) - JWT authentication
- **nodemailer** (^7.0.3) - Email functionality
- **multer** (^2.0.1) - File upload handling
- **helmet** (^7.1.0) - Security headers
- **cors** (^2.8.5) - Cross-origin resource sharing
- **express-rate-limit** (^7.1.5) - Rate limiting
- **express-mongo-sanitize** (^2.2.0) - MongoDB injection protection
- **xss-clean** (^0.1.4) - XSS protection
- **compression** (^1.7.4) - Response compression
- **winston** (^3.11.0) - Logging
- **morgan** (^1.10.0) - HTTP request logging

## Server Configuration

### Main Server File (`server.js`)

The server.js file is the entry point that configures the Express application with all necessary middleware and routes.

#### Key Configuration Steps:

1. **Environment Setup**
   ```javascript
   require('dotenv').config();
   ```
   - Loads environment variables from .env file

2. **Security Headers (Helmet)**
   ```javascript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         imgSrc: ["'self'", "http://localhost:3000", ...],
         // ... other security directives
       }
     }
   }));
   ```
   - Implements Content Security Policy
   - Protects against XSS, clickjacking, and other attacks

3. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: [
       process.env.FRONTEND_URL || 'http://localhost:3000',
       // ... other allowed origins
     ],
     credentials: true
   }));
   ```
   - Enables cross-origin requests
   - Allows credentials (cookies, authorization headers)

4. **Body Parsing**
   ```javascript
   app.use(express.json({ limit: '10kb' }));
   app.use(express.urlencoded({ extended: true, limit: '10kb' }));
   app.use(cookieParser());
   ```
   - Parses JSON and URL-encoded bodies
   - Limits request size to prevent abuse
   - Parses cookies

5. **Data Sanitization**
   ```javascript
   app.use(mongoSanitize());
   app.use(xss());
   ```
   - Prevents NoSQL injection attacks
   - Sanitizes user input against XSS

6. **Compression**
   ```javascript
   app.use(compression());
   ```
   - Compresses response bodies for better performance

7. **Logging**
   ```javascript
   app.use(morganMiddleware);
   ```
   - Logs HTTP requests for debugging and monitoring

8. **Static File Serving**
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```
   - Serves uploaded files with proper CORS headers

9. **Route Registration**
   ```javascript
   app.use('/api/v1/auth', authRoutes);
   app.use('/api/v1/products', productRoutes);
   // ... other routes
   ```
   - Registers all API routes with versioning

10. **Error Handling**
    ```javascript
    app.use(errorHandler);
    ```
    - Global error handling middleware

11. **Database Connection**
    ```javascript
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    ```
    - Connects to MongoDB Atlas
    - Handles connection events

12. **Cleanup Tasks**
    ```javascript
    setInterval(() => {
      // Clean up expired registrations and password resets
    }, 5 * 60 * 1000);
    ```
    - Periodic cleanup of expired data

## Database Models

### User Model (`models/User.js`)

**Purpose**: Defines user schema and authentication methods

**Key Features**:
- **Schema Fields**:
  - `name`, `firstName`, `lastName` - User identification
  - `email` - Unique email with validation
  - `phoneNumber` - Phone with regex validation
  - `company` - Optional company name
  - `address` - Nested address object
  - `password` - Hashed password (not selected by default)
  - `role` - User role (user/admin)
  - `isEmailVerified` - Email verification status
  - `passwordResetToken` - For password reset functionality

- **Pre-save Middleware**:
  ```javascript
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  ```
  - Automatically hashes passwords before saving

- **Instance Methods**:
  ```javascript
  userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  ```
  - Compares candidate password with stored hash

### Product Model (`models/Product.js`)

**Purpose**: Defines product schema for e-commerce functionality

**Key Features**:
- Product information (name, description, price, category)
- Inventory management (stock quantity)
- Image handling (multiple images)
- Category relationships
- Timestamps for creation and updates

### Order Model (`models/Order.js`)

**Purpose**: Manages order processing and status tracking

**Key Features**:
- Order items with product references
- Shipping and billing addresses
- Payment status tracking
- Order status management
- Total calculation methods

### Cart Model (`models/Cart.js`)

**Purpose**: Handles shopping cart functionality

**Key Features**:
- User-specific cart items
- Product quantity management
- Total calculation
- Cart expiration handling

### Other Models
- **Category** - Product categorization
- **RepairJob** - Service/repair job tracking
- **Quotation** - Price quote management
- **Query** - Customer inquiry handling

## Controllers

### Auth Controller (`controllers/authController.js`)

**Purpose**: Handles all authentication-related operations

**Major Functions**:

1. **register()** - User registration with email verification
   ```javascript
   exports.register = async (req, res) => {
     // 1. Validate input data
     // 2. Check for existing user
     // 3. Generate OTP
     // 4. Send verification email
     // 5. Store pending registration
   };
   ```

2. **verifyEmail()** - Email verification with OTP
   ```javascript
   exports.verifyEmail = async (req, res) => {
     // 1. Validate OTP
     // 2. Create user account
     // 3. Send welcome email
   };
   ```

3. **login()** - User authentication
   ```javascript
   exports.login = async (req, res) => {
     // 1. Validate credentials
     // 2. Check password
     // 3. Generate JWT token
     // 4. Update last login
   };
   ```

4. **forgotPassword()** - Password reset initiation
   ```javascript
   exports.forgotPassword = async (req, res) => {
     // 1. Find user by email
     // 2. Generate reset token
     // 3. Send reset email
   };
   ```

5. **resetPassword()** - Password reset completion
   ```javascript
   exports.resetPassword = async (req, res) => {
     // 1. Validate reset token
     // 2. Update password
     // 3. Clear reset token
   };
   ```

6. **protect()** - Route protection middleware
   ```javascript
   exports.protect = async (req, res, next) => {
     // 1. Get token from cookies/headers
     // 2. Verify JWT token
     // 3. Check if user exists
     // 4. Add user to request object
   };
   ```

7. **restrictTo()** - Role-based access control
   ```javascript
   exports.restrictTo = (...roles) => {
     return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
         return next(new AppError('You do not have permission to perform this action', 403));
       }
       next();
     };
   };
   ```

### Product Controller (`controllers/productController.js`)

**Purpose**: Manages product CRUD operations

**Major Functions**:
- `getAllProducts()` - Retrieve all products with filtering
- `getProduct()` - Get single product by ID
- `createProduct()` - Create new product (admin only)
- `updateProduct()` - Update product details
- `deleteProduct()` - Remove product
- `uploadProductImages()` - Handle product image uploads

### Order Controller (`controllers/orderController.js`)

**Purpose**: Handles order processing and management

**Major Functions**:
- `createOrder()` - Create new order from cart
- `getOrders()` - Retrieve user orders
- `getOrder()` - Get specific order details
- `updateOrderStatus()` - Update order status (admin)
- `cancelOrder()` - Cancel order functionality

### Cart Controller (`controllers/cartController.js`)

**Purpose**: Manages shopping cart operations

**Major Functions**:
- `addToCart()` - Add product to cart
- `getCart()` - Retrieve user's cart
- `updateCartItem()` - Update item quantity
- `removeFromCart()` - Remove item from cart
- `clearCart()` - Empty entire cart

## Routes

### Route Structure

All routes follow RESTful conventions and are versioned (`/api/v1/`):

1. **Auth Routes** (`/api/v1/auth`)
   - POST `/register` - User registration
   - POST `/verify-email` - Email verification
   - POST `/login` - User login
   - POST `/logout` - User logout
   - POST `/forgot-password` - Password reset request
   - POST `/reset-password` - Password reset
   - GET `/me` - Get current user
   - PATCH `/update-password` - Update password

2. **Product Routes** (`/api/v1/products`)
   - GET `/` - Get all products
   - GET `/:id` - Get single product
   - POST `/` - Create product (admin)
   - PATCH `/:id` - Update product (admin)
   - DELETE `/:id` - Delete product (admin)
   - POST `/upload-images` - Upload product images

3. **Order Routes** (`/api/v1/orders`)
   - POST `/` - Create order
   - GET `/` - Get user orders
   - GET `/:id` - Get specific order
   - PATCH `/:id/status` - Update order status (admin)

4. **Cart Routes** (`/api/v1/cart`)
   - POST `/add` - Add to cart
   - GET `/` - Get cart
   - PATCH `/update` - Update cart item
   - DELETE `/remove/:productId` - Remove from cart
   - DELETE `/clear` - Clear cart

5. **Other Routes**
   - **User Routes** - User profile management
   - **Category Routes** - Product categorization
   - **Query Routes** - Customer inquiries
   - **Repair Job Routes** - Service requests
   - **Quotation Routes** - Price quotes
   - **Upload Routes** - File upload handling

## Middleware

### Error Handler (`middleware/errorHandler.js`)

**Purpose**: Global error handling middleware

**Features**:
- Handles different types of errors (validation, JWT, etc.)
- Sends appropriate error responses
- Logs errors for debugging
- Development vs production error handling

### Logger (`middleware/logger.js`)

**Purpose**: Request logging and application logging

**Features**:
- HTTP request logging with Morgan
- Winston logger for application events
- Different log levels (info, error, warn)
- Log file rotation

### Rate Limiter (`middleware/rateLimiter.js`)

**Purpose**: Prevents API abuse

**Features**:
- Limits requests per IP address
- Configurable time windows
- Different limits for different endpoints

### Validation (`middleware/validate.js`)

**Purpose**: Input validation middleware

**Features**:
- Request body validation
- Parameter validation
- Custom validation rules

## Utilities

### Email Utility (`utils/email.js`)

**Purpose**: Email sending functionality

**Features**:
- Nodemailer configuration
- HTML email templates
- Error handling
- Multiple email types (verification, reset, etc.)

### Async Error Handler (`utils/catchAsync.js`)

**Purpose**: Wraps async functions to handle errors

```javascript
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

### App Error (`utils/appError.js`)

**Purpose**: Custom error class for application errors

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}
```

## Security Features

### 1. **JWT Authentication**
- Token-based authentication
- Secure cookie storage
- Token expiration handling
- Refresh token mechanism

### 2. **Password Security**
- bcrypt hashing (salt rounds: 10)
- Password strength validation
- Secure password reset flow

### 3. **Input Validation**
- Request body validation
- SQL/NoSQL injection prevention
- XSS protection
- Data sanitization

### 4. **Rate Limiting**
- API rate limiting
- Brute force protection
- DDoS mitigation

### 5. **Security Headers**
- Helmet.js implementation
- Content Security Policy
- CORS configuration
- Secure cookie settings

### 6. **File Upload Security**
- File type validation
- File size limits
- Secure file storage
- Malware scanning (conceptual)

## API Endpoints

### Authentication Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
PATCH  /api/v1/auth/update-password
```

### Product Endpoints
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
POST   /api/v1/products/upload-images
```

### Order Endpoints
```
POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status
```

### Cart Endpoints
```
POST   /api/v1/cart/add
GET    /api/v1/cart
PATCH  /api/v1/cart/update
DELETE /api/v1/cart/remove/:productId
DELETE /api/v1/cart/clear
```

## Key Functions & Concepts

### 1. **JWT Token Management**
```javascript
const signToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};
```

### 2. **Password Hashing**
```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### 3. **Error Handling Pattern**
```javascript
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

### 4. **MongoDB Aggregation**
```javascript
const products = await Product.aggregate([
  { $match: { category: categoryId } },
  { $group: { _id: null, total: { $sum: 1 } } }
]);
```

### 5. **File Upload Handling**
```javascript
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  }
});
```

### 6. **Email Templates**
```javascript
const sendVerificationEmail = async (email, otp) => {
  const html = `
    <h1>Email Verification</h1>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `;
  
  await sendEmail({
    email,
    subject: 'Email Verification',
    html
  });
};
```

### 7. **Database Transactions**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Database operations
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### 8. **Pagination**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const products = await Product.find()
  .skip(skip)
  .limit(limit);
```

### 9. **Search and Filtering**
```javascript
const searchQuery = req.query.search;
const categoryFilter = req.query.category;

let query = Product.find();

if (searchQuery) {
  query = query.find({
    $or: [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ]
  });
}

if (categoryFilter) {
  query = query.find({ category: categoryFilter });
}
```

### 10. **Response Standardization**
```javascript
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};
```

## Development Workflow

### 1. **Environment Setup**
- Create `.env` file with required variables
- Install dependencies with `npm install`
- Set up MongoDB connection

### 2. **Development Commands**
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
npm run seed   # Seed database with sample data
```

### 3. **Testing Endpoints**
- Use Postman or similar tool for API testing
- Test all CRUD operations
- Verify authentication flow
- Check error handling

### 4. **Deployment Considerations**
- Set production environment variables
- Configure MongoDB Atlas connection
- Set up proper CORS origins
- Enable security headers
- Configure logging and monitoring

This backend structure provides a robust, scalable, and secure foundation for the MERN stack e-commerce application with comprehensive authentication, product management, order processing, and user management capabilities.
