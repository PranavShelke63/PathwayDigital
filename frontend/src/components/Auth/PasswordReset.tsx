import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { forgotPassword, resetPassword, resendPasswordResetOTP } = useAuth();

  useEffect(() => {
    // Get email from location state or URL params
    const emailFromState = location.state?.email;
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [location]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isOtpSent && Boolean(password || confirmPassword));
  }, [isOtpSent, password, confirmPassword]);

  // Warn user when trying to leave during password setup
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmLeave) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setSendLoading(true);
    setMessage('');

    try {
      await forgotPassword(email);
      setIsOtpSent(true);
      setMessage('✅ Verification code sent to your email. Please check your inbox.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send verification code';
      if (errorMessage.includes('not found')) {
        setMessage('❌ No account found with this email address.');
      } else {
        setMessage(`❌ ${errorMessage}`);
      }
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    if (!password || password.length < 8) {
      setMessage('Please enter a password (minimum 8 characters)');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setVerifyLoading(true);
    setMessage('');

    try {
      // Call the backend to verify OTP and reset password in one step
      await resetPassword({ email, otp, password });
      setMessage('✅ Password reset successfully! Redirecting to login...');
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      if (errorMessage.includes('Invalid OTP') || errorMessage.includes('Invalid OTP or email')) {
        setMessage('❌ Invalid OTP. Please check your email and enter the correct 6-digit code.');
      } else if (errorMessage.includes('expired')) {
        setMessage('⏰ OTP has expired. Please request a new verification code.');
      } else {
        setMessage(`❌ ${errorMessage}`);
      }
    } finally {
      setVerifyLoading(false);
    }
  };



  const handleResendOTP = async () => {
    if (!email) {
      setMessage('Email is required');
      return;
    }

    setResendLoading(true);
    setMessage('');

    try {
      await resendPasswordResetOTP(email);
      setMessage('✅ New verification code sent. Please check your email.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const getInputClassName = (hasError: boolean) => {
    return `mt-1 appearance-none relative block w-full px-3 py-2 border ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-contrast">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a verification code
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Unsaved Changes
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You have unsaved password changes. Please complete your password reset or your progress will be lost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Email Input */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Step 1: Enter Your Email
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the email address associated with your account.
            </p>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getInputClassName(false)}
                  placeholder="Enter your email address"
                  disabled={isOtpSent}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sendLoading || isOtpSent}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendLoading ? (
                  <LoadingSpinner size="sm" color="white" inline={true} message="Sending..." />
                ) : isOtpSent ? (
                  '✓ Code Sent'
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          </div>

          {/* Step 2: OTP Verification and Password Reset */}
          {isOtpSent && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Step 2: Verify Your Email and Set New Password
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a 6-digit verification code to <strong>{email}</strong>. 
                Please check your inbox and enter the code along with your new password below.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Check your email
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        If you don't see the email, check your spam folder. 
                        The verification code expires in 10 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={getInputClassName(false)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={getInputClassName(false)}
                    placeholder="Enter your new password"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={getInputClassName(false)}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyLoading ? (
                    <LoadingSpinner size="sm" color="white" inline={true} message="Resetting password..." />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <LoadingSpinner size="sm" color="gray" inline={true} message="Sending..." />
                  ) : (
                    'Resend Verification Code'
                  )}
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm ${
              message.includes('✅') || message.includes('success')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset; 