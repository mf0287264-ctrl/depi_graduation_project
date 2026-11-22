// Centralized API Base URLs for the 4 independent backend microservices
export const API_URLS = {
  USER_SERVICE: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:4001',
  CATALOG_SERVICE: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://localhost:4002',
  SEARCH_SERVICE: import.meta.env.VITE_SEARCH_SERVICE_URL || 'http://localhost:4003',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:4004',
};

// Generic helper for JSON fetch requests
export async function request(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // If body is FormData (for avatar uploads), let browser set Content-Type with boundary
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const storedUserId = localStorage.getItem('userId');
  if (storedUserId) {
    defaultHeaders['x-user-id'] = storedUserId;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = (data && data.error) || (data && data.message) || `HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message);
    throw error;
  }
}

// Helper to format image paths
export function formatImageUrl(path) {
  if (!path) return '/assets/hero2.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.replace(/^[\.\/]+/, '');
  return `/${cleanPath}`;
}
