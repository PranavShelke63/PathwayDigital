// Utility function to get the correct backend base URL for images
export const getBackendBaseUrl = (): string => {
  const hostname = window.location.hostname;
  
  // If accessing from mobile/network IP, use the same IP for backend
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5000`;
  }
  
  return process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
};

// Utility function to get image URL
export const getImageUrl = (image: string | undefined): string => {
  if (!image) return '';
  return image.startsWith('http') ? image : `${getBackendBaseUrl()}/${image}`;
}; 