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

// Register new user (step 1: send verification email)
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
      countryRegion
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

    // Store registration data in session/memory for verification
    const registrationData = {
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
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: Date.now()
    };

    // Store in a temporary collection or use a more sophisticated approach
    // For now, we'll use a simple in-memory store (in production, use Redis or database)
    if (!global.pendingRegistrations) {
      global.pendingRegistrations = new Map();
    }
    
    global.pendingRegistrations.set(email.toLowerCase(), registrationData);

    // Send verification email with OTP
    const message = `Welcome to our platform! Your email verification code is: ${registrationData.otp}\n\nThis code will expire in 10 minutes. Please enter this code to verify your email address.`;

    try {
      await sendEmail({
        email: registrationData.email,
        subject: 'Email Verification Code',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent. Please check your email to complete registration.',
        data: { email: registrationData.email }
      });
    } catch (error) {
      // Clean up pending registration if email fails
      global.pendingRegistrations.delete(email.toLowerCase());
      
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again.',
        errors: { email: 'Email service temporarily unavailable' }
      });
    }
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

    // Update last login time
    user.lastLoginTime = new Date();
    await user.save({ validateBeforeSave: false });

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

// Forgot password - send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
        errors: { email: 'Email is required' }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with this email address',
        errors: { email: 'Email not found' }
      });
    }

    // Generate OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetData = {
      email: email.toLowerCase(),
      otp: otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: Date.now()
    };

    // Store reset data in memory
    if (!global.pendingPasswordResets) {
      global.pendingPasswordResets = new Map();
    }
    global.pendingPasswordResets.set(email.toLowerCase(), resetData);

    // Send OTP email
    const message = `You requested a password reset. Your verification code is: ${otp}\n\nThis code will expire in 10 minutes. If you didn't request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Verification Code',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Verification code sent to email',
        data: { email: user.email }
      });
    } catch (error) {
      // Clean up if email fails
      global.pendingPasswordResets.delete(email.toLowerCase());
      
      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later.',
        errors: { email: 'Email service temporarily unavailable' }
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to process password reset request',
      errors: { general: error.message }
    });
  }
};

// Verify OTP and reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, OTP, and password are required',
        errors: {
          email: !email ? 'Email is required' : '',
          otp: !otp ? 'OTP is required' : '',
          password: !password ? 'Password is required' : ''
        }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long',
        errors: { password: 'Password must be at least 8 characters long' }
      });
    }

    // Get pending password reset data
    const resetData = global.pendingPasswordResets?.get(email.toLowerCase());
    
    if (!resetData) {
      return res.status(400).json({
        status: 'error',
        message: 'No password reset request found. Please request a new reset.',
        errors: { email: 'Reset request not found' }
      });
    }

    // Check if OTP is expired
    if (resetData.otpExpires < Date.now()) {
      global.pendingPasswordResets.delete(email.toLowerCase());
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired. Please request a new reset.',
        errors: { otp: 'OTP expired' }
      });
    }

    // Verify OTP
    if (resetData.otp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP. Please check your code and try again.',
        errors: { otp: 'Invalid OTP' }
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      global.pendingPasswordResets.delete(email.toLowerCase());
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        errors: { email: 'User not found' }
      });
    }

    // Set new password
    user.password = password;
    user.lastLoginTime = new Date();
    await user.save();

    // Clean up pending reset
    global.pendingPasswordResets.delete(email.toLowerCase());

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to reset password',
      errors: { general: error.message }
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

// Verify email with OTP (don't create user yet)
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and OTP are required',
        errors: {
          email: !email ? 'Email is required' : '',
          otp: !otp ? 'OTP is required' : ''
        }
      });
    }

    // Get pending registration data
    const pendingRegistration = global.pendingRegistrations?.get(email.toLowerCase());
    
    if (!pendingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'No pending registration found for this email. Please register again.',
        errors: { email: 'Registration expired or not found' }
      });
    }

    // Check if OTP is expired
    if (pendingRegistration.otpExpires < Date.now()) {
      global.pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        status: 'error',
        message: 'OTP has expired. Please register again.',
        errors: { otp: 'OTP expired' }
      });
    }

    // Verify OTP
    if (pendingRegistration.otp !== otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP. Please check your code and try again.',
        errors: { otp: 'Invalid OTP' }
      });
    }

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      global.pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered',
        errors: { email: 'Email is already registered' }
      });
    }

    // Mark registration as verified but don't create user yet
    pendingRegistration.isVerified = true;
    pendingRegistration.verifiedAt = Date.now();
    global.pendingRegistrations.set(email.toLowerCase(), pendingRegistration);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You can now set your password.',
      data: { email: pendingRegistration.email }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to verify email'
    });
  }
};

// Set password and create user account
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
        errors: {
          email: !email ? 'Email is required' : '',
          password: !password ? 'Password is required' : ''
        }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long',
        errors: { password: 'Password must be at least 8 characters long' }
      });
    }

    // Get verified pending registration
    const pendingRegistration = global.pendingRegistrations?.get(email.toLowerCase());
    
    if (!pendingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'No pending registration found. Please register again.',
        errors: { email: 'Registration not found' }
      });
    }

    if (!pendingRegistration.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email must be verified before setting password',
        errors: { email: 'Email not verified' }
      });
    }

    // Check if verification is still valid (within 30 minutes)
    const verificationAge = Date.now() - pendingRegistration.verifiedAt;
    if (verificationAge > 30 * 60 * 1000) { // 30 minutes
      global.pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        status: 'error',
        message: 'Email verification has expired. Please register again.',
        errors: { email: 'Verification expired' }
      });
    }

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      global.pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered',
        errors: { email: 'Email is already registered' }
      });
    }

    // Create the user account with the provided password
    const user = await User.create({
      name: `${pendingRegistration.firstName} ${pendingRegistration.lastName}`,
      firstName: pendingRegistration.firstName,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      phoneNumber: pendingRegistration.phoneNumber,
      company: pendingRegistration.company,
      address: pendingRegistration.address,
      password: password, // Use the provided password
      isEmailVerified: true,
      lastLoginTime: new Date()
    });

    // Clean up pending registration
    global.pendingRegistrations.delete(email.toLowerCase());

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Set password error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to set password',
      errors: { general: error.message }
    });
  }
};

// Resend password reset OTP
exports.resendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
        errors: { email: 'Email is required' }
      });
    }

    // Check if there's a pending password reset
    const resetData = global.pendingPasswordResets?.get(email.toLowerCase());
    
    if (!resetData) {
      return res.status(404).json({
        status: 'error',
        message: 'No password reset request found. Please request a new reset.',
        errors: { email: 'Reset request not found' }
      });
    }

    // Check if user still exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      global.pendingPasswordResets.delete(email.toLowerCase());
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        errors: { email: 'User not found' }
      });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    resetData.otp = newOtp;
    resetData.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Send new OTP email
    const message = `Your new password reset verification code is: ${newOtp}\n\nThis code will expire in 10 minutes. If you didn't request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Verification Code',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'New verification code sent to email.',
        data: { email: user.email }
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification code. Please try again.',
        errors: { email: 'Email service temporarily unavailable' }
      });
    }
  } catch (error) {
    console.error('Resend password reset OTP error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to resend verification code',
      errors: { general: error.message }
    });
  }
};

// Resend verification email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
        errors: { email: 'Email is required' }
      });
    }

    // Check if there's a pending registration
    const pendingRegistration = global.pendingRegistrations?.get(email.toLowerCase());
    
    if (!pendingRegistration) {
      return res.status(404).json({
        status: 'error',
        message: 'No pending registration found. Please register again.',
        errors: { email: 'Registration not found' }
      });
    }

    // Check if user already exists (in case verification was completed)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      global.pendingRegistrations.delete(email.toLowerCase());
      return res.status(400).json({
        status: 'error',
        message: 'Email is already registered',
        errors: { email: 'Email is already registered' }
      });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingRegistration.otp = newOtp;
    pendingRegistration.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Send verification email with new OTP
    const message = `Your new email verification code is: ${newOtp}\n\nThis code will expire in 10 minutes. Please enter this code to verify your email address.`;

    try {
      await sendEmail({
        email: pendingRegistration.email,
        subject: 'Email Verification Code',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent. Please check your email.',
        data: { email: pendingRegistration.email }
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send verification email. Please try again.',
        errors: { email: 'Email service temporarily unavailable' }
      });
    }
  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to resend verification email',
      errors: { general: error.message }
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