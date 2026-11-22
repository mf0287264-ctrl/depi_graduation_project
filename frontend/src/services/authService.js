import { API_URLS, request } from './api';

const BASE = API_URLS.USER_SERVICE;

export const authService = {
  // POST /api/signup
  async signup(username, email, password) {
    return request(`${BASE}/api/signup`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  // POST /api/login
  async login(username, password) {
    return request(`${BASE}/api/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // GET /api/user/:id
  async getUser(userId) {
    return request(`${BASE}/api/user/${userId}`);
  },

  // POST /api/upload-avatar/:id
  async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);

    return request(`${BASE}/api/upload-avatar/${userId}`, {
      method: 'POST',
      body: formData,
    });
  },

  // PUT /api/update-user/:id
  async updateUser(userId, data) {
    return request(`${BASE}/api/update-user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/delete-account/:id
  async deleteAccount(userId) {
    return request(`${BASE}/api/delete-account/${userId}`, {
      method: 'DELETE',
    });
  },

  // POST /api/logout
  async logout() {
    return request(`${BASE}/api/logout`, {
      method: 'POST',
    });
  },
};
