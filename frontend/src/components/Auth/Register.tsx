import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface CountryData {
  [key: string]: {
    name: string;
    states: string[];
  };
}

const countries: CountryData = {
  US: {
    name: "United States",
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
      "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
      "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
      "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
      "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
      "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ]
  },
  CA: {
    name: "Canada",
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
      "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
      "Northwest Territories", "Nunavut", "Yukon"
    ]
  },
  UK: {
    name: "United Kingdom",
    states: [
      "England", "Scotland", "Wales", "Northern Ireland"
    ]
  },
  AU: {
    name: "Australia",
    states: [
      "New South Wales", "Victoria", "Queensland", "Western Australia", 
      "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
    ]
  },
  IN: {
    name: "India",
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
      "West Bengal"
    ]
  }
};

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
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    countryRegion: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  useEffect(() => {
    if (formData.countryRegion && countries[formData.countryRegion]) {
      setAvailableStates(countries[formData.countryRegion].states);
      setFormData(prev => ({ ...prev, state: '' })); // Reset state when country changes
    } else {
      setAvailableStates([]);
    }
  }, [formData.countryRegion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Special handling for country selection
    if (name === 'countryRegion') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.address?.country;
        if (Object.keys(newErrors.address || {}).length === 0) {
          delete newErrors.address;
        }
        return newErrors;
      });
    } else {
      // Clear error for the changed field
      setErrors(prev => {
        const newErrors = { ...prev };
        if (name.includes('.')) {
          const [parent, child] = name.split('.');
          if (parent === 'address' && newErrors.address) {
            const addressErrors = { ...newErrors.address };
            delete addressErrors[child as keyof typeof newErrors.address];
            if (Object.keys(addressErrors).length === 0) {
              delete newErrors.address;
            } else {
              newErrors.address = addressErrors;
            }
          }
        } else if (name in newErrors) {
          delete newErrors[name as keyof ValidationErrors];
        }
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    // Address validation
    const addressErrors: Record<string, string> = {};
    
    if (!formData.countryRegion) {
      addressErrors.country = 'Country/Region is required';
    }
    if (!formData.street.trim()) {
      addressErrors.street = 'Street address is required';
    }
    if (!formData.city.trim()) {
      addressErrors.city = 'City is required';
    }
    if (!formData.state && formData.countryRegion) {
      addressErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      addressErrors.zipCode = 'ZIP Code is required';
    }

    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const countryName = countries[formData.countryRegion].name;
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        company: formData.company.trim() || undefined,
        countryRegion: countryName,
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zipCode: formData.zipCode.trim(),
        password: formData.password
      };

      await register(registrationData);
      
      // Check if there's a redirect location from ProtectedRoute
      const from = location.state?.from?.pathname;
      
      // Redirect to intended page or home
      navigate(from || '/');
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors || {};
      setErrors(serverErrors);
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const hasError = fieldName.includes('.')
      ? errors[fieldName.split('.')[0] as keyof ValidationErrors]?.[fieldName.split('.')[1] as keyof typeof errors.address]
      : errors[fieldName as keyof ValidationErrors];

    return `mt-1 appearance-none relative block w-full px-3 py-2 border ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-contrast">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              to="/login" 
              state={{ from: location.state?.from }}
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={getInputClassName('firstName')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={getInputClassName('lastName')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={getInputClassName('email')}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className={getInputClassName('phoneNumber')}
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className={getInputClassName('company')}
                value={formData.company}
                onChange={handleInputChange}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            {/* Address Fields */}
            <div>
              <label htmlFor="countryRegion" className="block text-sm font-medium text-gray-700">
                Country/Region *
              </label>
              <select
                id="countryRegion"
                name="countryRegion"
                required
                className={getInputClassName('address.country')}
                value={formData.countryRegion}
                onChange={handleInputChange}
              >
                <option value="">Select a country</option>
                {Object.entries(countries).map(([code, country]) => (
                  <option key={code} value={code}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.address?.country && (
                <p className="mt-1 text-sm text-red-600">{errors.address.country}</p>
              )}
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street *
              </label>
              <input
                id="street"
                name="street"
                type="text"
                required
                className={getInputClassName('address.street')}
                value={formData.street}
                onChange={handleInputChange}
              />
              {errors.address?.street && (
                <p className="mt-1 text-sm text-red-600">{errors.address.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className={getInputClassName('address.city')}
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  className={getInputClassName('address.state')}
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!formData.countryRegion}
                >
                  <option value="">Select a state/province</option>
                  {availableStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.address?.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.state}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code *
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                required
                className={getInputClassName('address.zipCode')}
                value={formData.zipCode}
                onChange={handleInputChange}
              />
              {errors.address?.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.address.zipCode}</p>
              )}
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={getInputClassName('password')}
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={getInputClassName('confirmPassword')}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            By clicking Sign Up, you agree to our{' '}
            <Link to="/terms" className="font-medium text-primary hover:text-primary/80">
              Terms of Service
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 