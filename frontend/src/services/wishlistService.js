import { API_URLS, request } from './api';

const BASE = API_URLS.USER_SERVICE;

export const wishlistService = {
  // GET /api/wishlist/:userId
  async getWishlist(userId) {
    if (!userId) return [];
    const res = await request(`${BASE}/api/wishlist/${userId}`);
    return res.data || [];
  },

  // POST /api/wishlist/add
  async addToWishlist(userId, carId) {
    return request(`${BASE}/api/wishlist/add`, {
      method: 'POST',
      body: JSON.stringify({ userId, carId }),
    });
  },

  // POST /api/wishlist/remove
  async removeFromWishlist(userId, carId) {
    return request(`${BASE}/api/wishlist/remove`, {
      method: 'POST',
      body: JSON.stringify({ userId, carId }),
    });
  },

  // Check if item is in wishlist
  async checkWishlist(userId, carId) {
    try {
      const res = await request(`${BASE}/api/wishlist/check/${userId}/${carId}`);
      return Boolean(res.inWishlist);
    } catch {
      return false;
    }
  }
};
