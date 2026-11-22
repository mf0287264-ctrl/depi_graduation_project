import { API_URLS, request } from './api';

const CATALOG_BASE = API_URLS.CATALOG_SERVICE;
const SEARCH_BASE = API_URLS.SEARCH_SERVICE;

export const carService = {
  // GET /api/cars (All inventory from Catalog Service)
  async getAllCars() {
    const res = await request(`${CATALOG_BASE}/api/cars`);
    return res.data || [];
  },

  // GET /api/cars/:id (Single car details)
  async getCarById(id) {
    const res = await request(`${CATALOG_BASE}/api/cars/${id}`);
    return res.data;
  },

  // GET /api/search (Dedicated Filtering & Search Service)
  async searchCars(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.make && params.make !== 'All' && params.make !== 'Select Make') {
      query.append('make', params.make);
    }
    if (params.model && params.model !== 'All' && params.model !== 'Select Model') {
      query.append('model', params.model);
    }
    if (params.priceRange && params.priceRange !== 'Price Range') {
      query.append('priceRange', params.priceRange);
    }
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    const url = queryString ? `${SEARCH_BASE}/api/search?${queryString}` : `${SEARCH_BASE}/api/search`;
    const res = await request(url);
    return res.data || [];
  },

  // GET /api/search/filters (Distinct options for filter UI)
  async getFilters() {
    try {
      return await request(`${SEARCH_BASE}/api/search/filters`);
    } catch {
      // Graceful fallback
      return {
        makes: ['Ferrari', 'Lamborghini', 'McLaren', 'Porsche', 'Audi', 'Lexus', 'Bentley', 'Nissan', 'Acura', 'Hyundai'],
        modelsByMake: {},
        stats: { minPrice: 10000, maxPrice: 3800000, totalCars: 16 }
      };
    }
  }
};
