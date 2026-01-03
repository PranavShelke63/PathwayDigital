// Utility function to get the correct backend base URL for images
export const getBackendBaseUrl = (): string => {
  // If REACT_APP_API_URL is set, use it (for production)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace('/api/v1', '');
  }

  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // For localhost, always use HTTP
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // For production/HTTPS, use HTTPS protocol
  // If page is loaded over HTTPS, use HTTPS for API calls
  if (protocol === 'https:') {
    return `https://${hostname}`;
  }
  
  // Fallback to HTTP for network IPs (development)
  return `http://${hostname}:5000`;
};

// Utility function to get image URL
export const getImageUrl = (image: string | undefined): string => {
  if (!image) return '';
  return image.startsWith('http') ? image : `${getBackendBaseUrl()}/${image}`;
}; 