/**
 * Marketplace Context for UrbanFix
 * Manages services, categories, bookings lifecycle, payments, and admin data.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const MarketplaceContext = createContext(null);

export const MarketplaceProvider = ({ children }) => {
  const { user, isAuthenticated, role } = useAuth();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Customer state
  const [customerBookings, setCustomerBookings] = useState([]);

  // Provider state
  const [pendingRequests, setPendingRequests] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  // Fetch services with optional filters
  const fetchServices = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);

      const res = await api.get(`/services?${params.toString()}`);
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customer bookings
  const fetchCustomerBookings = useCallback(async () => {
    if (!isAuthenticated || role !== 'customer') return;
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setCustomerBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customer bookings', err);
    }
  }, [isAuthenticated, role]);

  // Fetch provider requests and active jobs
  const fetchProviderBookings = useCallback(async () => {
    if (!isAuthenticated || role !== 'provider') return;
    try {
      const res = await api.get('/bookings/provider-requests');
      if (res.data.success) {
        setPendingRequests(res.data.data.pendingRequests || []);
        setAssignedJobs(res.data.data.assignedJobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch provider requests', err);
    }
  }, [isAuthenticated, role]);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [fetchCategories, fetchServices]);

  // Sync bookings on role / auth change
  useEffect(() => {
    if (role === 'customer') {
      fetchCustomerBookings();
    } else if (role === 'provider') {
      fetchProviderBookings();
    }
  }, [role, fetchCustomerBookings, fetchProviderBookings]);

  // --- ACTIONS ---

  // 1. Submit service booking (Customer)
  const createBooking = async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    if (res.data.success) {
      fetchCustomerBookings();
      return { success: true, booking: res.data.data };
    }
    return { success: false, message: res.data.message };
  };

  // 2. Accept booking request (Provider - ATOMIC)
  const acceptBooking = async (bookingId) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/accept`);
      if (res.data.success) {
        fetchProviderBookings();
        return { success: true, booking: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to accept booking';
      return { success: false, message: msg, code: err.response?.data?.code };
    }
  };

  // 3. Reject booking request (Provider)
  const rejectBooking = async (bookingId) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/reject`);
      if (res.data.success) {
        setPendingRequests((prev) => prev.filter((b) => b.id !== bookingId));
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to decline request' };
    }
  };

  // 4. Start work (Provider)
  const startWork = async (bookingId) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/start`);
      if (res.data.success) {
        fetchProviderBookings();
        return { success: true, booking: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to start work' };
    }
  };

  // 5. Complete work (Provider)
  const completeWork = async (bookingId) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/complete`);
      if (res.data.success) {
        fetchProviderBookings();
        return { success: true, booking: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to complete job' };
    }
  };

  // 6. Cancel booking (Customer or Provider)
  const cancelBooking = async (bookingId) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        if (role === 'customer') fetchCustomerBookings();
        if (role === 'provider') fetchProviderBookings();
        return { success: true, booking: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to cancel booking' };
    }
  };

  // 7. Process payment (Customer - Razorpay Test Mode)
  const processPayment = async ({ bookingId, amount, paymentMethod, razorpayPaymentId }) => {
    try {
      const res = await api.post('/payments/verify', {
        bookingId,
        amount,
        paymentMethod: paymentMethod || 'Razorpay',
        razorpayPaymentId: razorpayPaymentId || `pay_rzp_${Date.now()}`,
      });
      if (res.data.success) {
        fetchCustomerBookings();
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Payment processing failed' };
    }
  };

  // 8. Submit customer review
  const submitReview = async ({ bookingId, rating, comment }) => {
    try {
      const res = await api.post('/reviews', { bookingId, rating, comment });
      if (res.data.success) {
        fetchCustomerBookings();
        return { success: true, review: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to submit review' };
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        categories,
        services,
        loading,
        customerBookings,
        pendingRequests,
        assignedJobs,
        fetchCategories,
        fetchServices,
        fetchCustomerBookings,
        fetchProviderBookings,
        createBooking,
        acceptBooking,
        rejectBooking,
        startWork,
        completeWork,
        cancelBooking,
        processPayment,
        submitReview,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
};
