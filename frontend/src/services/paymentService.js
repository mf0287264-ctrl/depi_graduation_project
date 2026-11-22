import { API_URLS, request } from './api';

const BASE = API_URLS.PAYMENT_SERVICE;

export const paymentService = {
  // POST /api/send-order-email
  async sendOrderEmail({ userEmail, carModel, totalPrice, image }) {
    return request(`${BASE}/api/send-order-email`, {
      method: 'POST',
      body: JSON.stringify({ userEmail, carModel, totalPrice, image }),
    });
  },

  // POST /api/checkout
  async checkout(orderData) {
    return request(`${BASE}/api/checkout`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // GET /api/orders/:id
  async getOrder(orderId) {
    return request(`${BASE}/api/orders/${orderId}`);
  }
};
