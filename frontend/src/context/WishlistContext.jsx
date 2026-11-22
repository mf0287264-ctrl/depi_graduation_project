import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { userId, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist(userId);
      setWishlist(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Wishlist load error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((carId) => {
    if (!carId) return false;
    return wishlist.some(c => Number(c.id) === Number(carId));
  }, [wishlist]);

  const addToWishlist = async (car) => {
    if (!userId) {
      throw new Error("Please log in to add cars to your Dream Garage");
    }
    await wishlistService.addToWishlist(userId, car.id);
    setWishlist(prev => {
      if (prev.some(c => Number(c.id) === Number(car.id))) return prev;
      return [...prev, car];
    });
  };

  const removeFromWishlist = async (carId) => {
    if (!userId) return;
    await wishlistService.removeFromWishlist(userId, carId);
    setWishlist(prev => prev.filter(c => Number(c.id) !== Number(carId)));
  };

  const removeMultiple = async (carIds) => {
    if (!userId || !carIds || carIds.length === 0) return;
    await Promise.all(carIds.map(id => wishlistService.removeFromWishlist(userId, id)));
    setWishlist(prev => prev.filter(c => !carIds.includes(Number(c.id))));
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      loading,
      fetchWishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      removeMultiple
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
