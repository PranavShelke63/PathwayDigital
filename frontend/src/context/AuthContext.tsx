import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
  countryRegion: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface SetPasswordData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
}

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  password?: string;
  general?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ValidationErrors | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyEmail: (data: VerifyEmailData) => Promise<void>;
  setPassword: (data: SetPasswordData) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  resendPasswordResetOTP: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ValidationErrors | null>(null);

  // Get the current hostname to determine the API URL
  const getApiUrl = () => {
    // If REACT_APP_API_URL is set, use it (for production)
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }

    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // For localhost, always use HTTP
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/api/v1';
    }
    
    // For production/HTTPS, use HTTPS protocol
    // If page is loaded over HTTPS, use HTTPS for API calls
    if (protocol === 'https:') {
      return `https://${hostname}/api/v1`;
    }
    
    // Fallback to HTTP for network IPs (development)
    return `http://${hostname}:5000/api/v1`;
  };

  const API_URL = getApiUrl();

  const clearError = () => setError(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true
      });
      setUser(response.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'An error occurred' });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        data,
        { withCredentials: true }
      );
      
      setError(null);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Registration failed' });
      throw error;
    }
  };

  const verifyEmail = async (data: VerifyEmailData) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/verify-email`,
        data,
        { withCredentials: true }
      );
      
      setError(null);
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Failed to verify email' });
      throw error;
    }
  };

  const setPassword = async (data: SetPasswordData) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/set-password`,
        data,
        { withCredentials: true }
      );
      
      setUser(response.data.data.user);
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Failed to set password' });
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      await axios.post(
        `${API_URL}/auth/resend-verification`,
        { email },
        { withCredentials: true }
      );
      
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Failed to resend verification email' });
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const response = await axios.patch(
        `${API_URL}/auth/updateProfile`,
        data,
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Failed to update profile' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Attempt to call the logout endpoint
      try {
        console.log('Calling logout API endpoint...');
        const response = await axios.get(`${API_URL}/auth/logout`, { 
          withCredentials: true,
          timeout: 5000 // 5 second timeout
        });
        console.log('Logout API response:', response.data);
      } catch (apiError: any) {
        // If it's a network error or timeout, we'll still proceed with local cleanup
        if (!apiError.response || apiError.code === 'ECONNABORTED') {
          console.warn('Logout API call failed, proceeding with local cleanup:', apiError);
        } else {
          console.error('Logout API error:', apiError.response?.data);
          throw apiError; // Re-throw other API errors
        }
      }
      
      // Clear user data first
      setUser(null);
      setError(null);
      
      // Clear any stored tokens or user data
      try {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Clear app-specific storage
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');
        
        // Clear all session storage
        sessionStorage.clear();
      } catch (storageError) {
        console.warn('Storage cleanup error:', storageError);
        // Continue with logout even if storage cleanup fails
      }
      
      // Clear all cookies
      try {
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
      } catch (cookieError) {
        console.warn('Cookie cleanup error:', cookieError);
        // Continue with logout even if cookie cleanup fails
      }
      
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || 'Logout failed';
      setError({ general: errorMessage });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await axios.post(`${API_URL}/auth/forgotPassword`, { email });
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError({ email: errorData?.message || 'Failed to process request' });
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/resetPassword`,
        data,
        { withCredentials: true }
      );
      
      setUser(response.data.data.user);
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Failed to reset password' });
      throw error;
    }
  };

  const resendPasswordResetOTP = async (email: string) => {
    try {
      await axios.post(
        `${API_URL}/auth/resend-password-reset`,
        { email },
        { withCredentials: true }
      );
      
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError(errorData?.errors || { general: errorData?.message || 'Failed to resend password reset OTP' });
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await axios.patch(
        `${API_URL}/auth/updatePassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setError(null);
    } catch (error: any) {
      const errorData = error.response?.data;
      setError({ password: errorData?.message || 'Failed to update password' });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    verifyEmail,
    setPassword,
    resendVerificationEmail,
    logout,
    forgotPassword,
    resetPassword,
    resendPasswordResetOTP,
    updatePassword,
    updateProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;