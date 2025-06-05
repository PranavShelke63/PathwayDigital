const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const sendEmail = require('../utils/email');

// Custom error handler
const handleError = (err) => {
  let errors = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    password: ''
  };

  // Duplicate email error
  if (err.code === 11000) {
    errors.email = 'Email is already registered';
    return errors;
  }

  // Validation errors
  if (err.message.includes('validation failed')) {
    Object.entries(err.errors).forEach(([path, error]) => {
      if (path.startsWith('address.')) {
        const addressField = path.split('.')[1];
        errors.address[addressField] = error.message;
      } else {
        errors[path] = error.message;
      }
    });
  }

  return errors;
};

// Generate JWT token
const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'your-super-strong-jwt-secret-key-here';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Send JWT token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      street,
      city,
      state,
      zipCode,
      countryRegion,
      password
    } = req.body;

    // Input validation with detailed errors
    const validationErrors = {};

    if (!firstName?.trim()) validationErrors.firstName = 'First Name is required';
    if (!lastName?.trim()) validationErrors.lastName = 'Last Name is required';
    if (!email?.trim()) validationErrors.email = 'Email is required';
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      validationErrors.email = 'Invalid email format';
    }
    if (!phoneNumber?.trim()) validationErrors.phoneNumber = 'Phone Number is required';
    if (phoneNumber && !/^\+?[\d\s-]{10,}$/.test(phoneNumber.trim())) {
      validationErrors.phoneNumber = 'Invalid phone number format';
    }
    if (!street?.trim()) validationErrors.address = { ...validationErrors.address, street: 'Street is required' };
    if (!city?.trim()) validationErrors.address = { ...validationErrors.address, city: 'City is required' };
    if (!state) validationErrors.address = { ...validationErrors.address, state: 'State is required' };
    if (!zipCode?.trim()) validationErrors.address = { ...validationErrors.address, zipCode: 'ZIP Code is required' };
    if (!countryRegion) validationErrors.address = { ...validationErrors.address, country: 'Country is required' };
    if (!password) validationErrors.password = 'Password is required';
    if (password && password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered',
        errors: { email: 'Email is already registered' }
      });
    }

    // Create user with all fields
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      company,
      address: {
        street,
        city,
        state,
        zipCode,
        country: countryRegion
      },
      password
    });

    createSendToken(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    const errors = handleError(error);
    res.status(400).json({
      status: 'error',
      message: 'Registration failed',
      errors
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
        errors: {
          email: !email ? 'Email is required' : '',
          password: !password ? 'Password is required' : ''
        }
      });
    }

    // Check if user exists & password is correct
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        errors: {
          email: 'Invalid email or password'
        }
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Login failed',
      errors: {
        general: error.message
      }
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 1 * 1000), // Expire in 1 second
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Clear any other session cookies
    res.clearCookie('connect.sid'); // Clear session cookie if using express-session
    
    // If using session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
      });
    }

    res.status(200).json({ 
      status: 'success',
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
};

// Protect routes middleware
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header or cookies
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token || token === 'loggedout') {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(
      token, 
      process.env.JWT_SECRET || 'your-super-strong-jwt-secret-key-here'
    );

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid token or session expired'
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to get user information'
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with this email address'
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset token email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email'
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later.'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to process password reset request'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired'
      });
    }

    // Validate new password
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to reset password'
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      company,
      address
    } = req.body;

    // Input validation
    const validationErrors = {};

    if (!firstName?.trim()) validationErrors.firstName = 'First Name is required';
    if (!lastName?.trim()) validationErrors.lastName = 'Last Name is required';
    if (!phoneNumber?.trim()) validationErrors.phoneNumber = 'Phone Number is required';
    if (phoneNumber && !/^\+?[\d\s-]{10,}$/.test(phoneNumber.trim())) {
      validationErrors.phoneNumber = 'Invalid phone number format';
    }
    if (!address?.street?.trim()) validationErrors.address = { ...validationErrors.address, street: 'Street is required' };
    if (!address?.city?.trim()) validationErrors.address = { ...validationErrors.address, city: 'City is required' };
    if (!address?.state) validationErrors.address = { ...validationErrors.address, state: 'State is required' };
    if (!address?.zipCode?.trim()) validationErrors.address = { ...validationErrors.address, zipCode: 'ZIP Code is required' };
    if (!address?.country) validationErrors.address = { ...validationErrors.address, country: 'Country is required' };

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: `${firstName} ${lastName}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        company: company?.trim(),
        address: {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state,
          zipCode: address.zipCode.trim(),
          country: address.country
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to update profile',
      errors: handleError(error)
    });
  }
}; 