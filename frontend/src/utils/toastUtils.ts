import toast from 'react-hot-toast';

// Custom toast functions with better UX
export const showToast = {
  // Success toast with custom options
  success: (message: string, options?: any) => {
    return toast.success(message, {
      duration: 4000,
      ...options,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
        ...options?.style,
      },
    });
  },

  // Error toast with custom options
  error: (message: string, options?: any) => {
    return toast.error(message, {
      duration: 5000, // Longer duration for errors
      ...options,
      style: {
        background: '#EF4444',
        color: '#fff',
        fontSize: '14px',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
        ...options?.style,
      },
    });
  },

  // Info toast with custom options
  info: (message: string, options?: any) => {
    return toast(message, {
      duration: 3000,
      ...options,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontSize: '14px',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
        ...options?.style,
      },
    });
  },

  // Loading toast (doesn't auto-dismiss)
  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      ...options,
      style: {
        background: '#6B7280',
        color: '#fff',
        fontSize: '14px',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
        ...options?.style,
      },
    });
  },

  // Dismiss a specific toast
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    toast.dismiss();
  },
};

// Mobile-specific toast options
export const mobileToastOptions = {
  duration: 3000, // Shorter duration on mobile
  style: {
    fontSize: '13px',
    padding: '10px 14px',
    borderRadius: '6px',
    minHeight: '44px', // Better touch target
  },
};

// Desktop-specific toast options
export const desktopToastOptions = {
  duration: 4000,
  style: {
    fontSize: '14px',
    padding: '12px 16px',
    borderRadius: '8px',
  },
};

// Detect if user is on mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Show toast with appropriate options based on device
export const showAdaptiveToast = {
  success: (message: string) => {
    const options = isMobile() ? mobileToastOptions : desktopToastOptions;
    return showToast.success(message, options);
  },

  error: (message: string) => {
    const options = isMobile() ? mobileToastOptions : desktopToastOptions;
    return showToast.error(message, options);
  },

  info: (message: string) => {
    const options = isMobile() ? mobileToastOptions : desktopToastOptions;
    return showToast.info(message, options);
  },
}; 