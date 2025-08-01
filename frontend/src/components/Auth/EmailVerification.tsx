import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const EmailVerification: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPasswordState] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, setPassword, resendVerificationEmail } = useAuth();

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(Boolean(isVerified && (password || confirmPassword)));
  }, [isVerified, password, confirmPassword]);

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

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyLoading(true);
    setMessage('');

    try {
      await verifyEmail({ email, otp });
      setIsVerified(true);
      setMessage('Email verified successfully! You can now set your password.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      setMessage('Please verify your email first');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await setPassword({ email, password });
      
      // Check if there's a redirect location from ProtectedRoute
      const from = location.state?.from?.pathname;
      
      // Redirect to intended page or home
      navigate(from || '/');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Email is required');
      return;
    }

    setResendLoading(true);
    setMessage('');

    try {
      await resendVerificationEmail(email);
      setMessage('Verification email sent successfully. Please check your inbox.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to resend verification email');
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
            Email Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please verify your email and set your password
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
                      You have unsaved password changes. Please complete your registration or your progress will be lost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Step 1: Verify Your Email
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit verification code to <strong>{email}</strong>. 
              Please check your inbox and enter the code below.
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

            <form onSubmit={handleVerifyEmail} className="space-y-4">
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

              <button
                type="submit"
                disabled={verifyLoading || isVerified}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyLoading ? (
                  <LoadingSpinner size="sm" color="white" inline={true} message="Verifying..." />
                ) : isVerified ? (
                  '✓ Email Verified'
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleResendEmail}
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

          {isVerified && (
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Step 2: Set Your Password
                  </h3>
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Email verified successfully
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your email has been verified! Now set a password for your account.
              </p>

                            <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${getInputClassName(false)} ${!isVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your email"
                    disabled={!isVerified}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPasswordState(e.target.value)}
                    className={`${getInputClassName(false)} ${!isVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder={isVerified ? "Enter your password" : "Verify email first"}
                    disabled={!isVerified}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {isVerified 
                      ? "Password must be at least 8 characters long"
                      : "Please verify your email before setting password"
                    }
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${getInputClassName(false)} ${!isVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder={isVerified ? "Confirm your password" : "Verify email first"}
                    disabled={!isVerified}
                    required
                  />
                </div>

              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes('success') || message.includes('sent')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isVerified}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <LoadingSpinner 
                    size="sm" 
                    color="white" 
                    inline={true} 
                    message="Setting password..." 
                  />
                ) : !isVerified ? (
                  'Verify Email First'
                ) : (
                  'Set Password & Complete Registration'
                )}
              </button>
                          </form>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
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

export default EmailVerification; 