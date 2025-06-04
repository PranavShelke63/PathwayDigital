import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Field {
  label: string;
  name: string;
  disabled?: boolean;
  optional?: boolean;
}

const Profile: React.FC = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        company: user.company || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        company: formData.company.trim() || undefined,
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          zipCode: formData.address.zipCode.trim(),
          country: formData.address.country.trim()
        }
      };

      await updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully!');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Failed to update password. Please check your current password.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        company: user.company || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  };

  const renderField = (field: Field) => {
    const value = field.name.includes('.')
      ? field.name.split('.').reduce((obj, key) => (obj as any)[key], formData)
      : formData[field.name as keyof FormData];

    return (
      <div key={field.name} className="py-4 grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-accent">
          {field.label}
          {field.optional && ' (Optional)'}
        </dt>
        <dd className="text-sm text-contrast col-span-2">
          {isEditing ? (
            <input
              type="text"
              name={field.name}
              value={value as string}
              onChange={handleInputChange}
              disabled={field.disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <span>{value as string}</span>
          )}
        </dd>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-contrast mb-2">My Profile</h1>
        <p className="text-accent">Manage your account settings and preferences.</p>
        {error && <p className="mt-2 text-red-600">{error}</p>}
        {success && <p className="mt-2 text-green-600">{success}</p>}
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Banner */}
        <div className="bg-primary px-6 py-8">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white text-primary flex items-center justify-center text-3xl font-bold">
              {formData.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">
                {`${formData.firstName} ${formData.lastName}`}
              </h2>
              <p className="text-white/80">{formData.email}</p>
              {formData.company && (
                <p className="text-accent mt-1">{formData.company}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="border-b border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-contrast">Personal Information</h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-primary/80"
                  >
                    Edit Information
                  </button>
                )}
              </div>
              <dl className="divide-y divide-gray-200">
                {[
                  { label: 'First Name', name: 'firstName' },
                  { label: 'Last Name', name: 'lastName' },
                  { label: 'Email', name: 'email', disabled: true },
                  { label: 'Phone Number', name: 'phoneNumber' },
                  { label: 'Company', name: 'company', optional: true }
                ].map(renderField)}
              </dl>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-contrast mb-4">Address Information</h3>
              <dl className="divide-y divide-gray-200">
                {[
                  { label: 'Street', name: 'address.street' },
                  { label: 'City', name: 'address.city' },
                  { label: 'State', name: 'address.state' },
                  { label: 'ZIP Code', name: 'address.zipCode' },
                  { label: 'Country', name: 'address.country' }
                ].map(renderField)}
              </dl>
            </div>

            {/* Form Actions */}
            {isEditing && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Password Change Form */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-contrast">Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-primary hover:text-primary/80"
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-accent mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-accent mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-accent mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;