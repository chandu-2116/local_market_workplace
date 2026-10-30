/**
 * Payments, Reviews, Admin, and Notifications Controllers
 */
import { marketplaceStore } from '../data/store.js';

// --- PAYMENTS ---
export const createPaymentOrder = (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const booking = marketplaceStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const orderId = `order_rzp_${Date.now()}`;
    return res.status(200).json({
      success: true,
      orderId,
      amount: amount || booking.amount,
      currency: 'USD',
      keyId: 'rzp_test_urbanfix_gateway',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = (req, res) => {
  try {
    const { bookingId, amount, paymentMethod, razorpayPaymentId } = req.body;
    const result = marketplaceStore.processPayment({
      bookingId,
      customerId: req.user.id,
      amount,
      paymentMethod,
      razorpayPaymentId,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and transaction recorded successfully!',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentHistory = (req, res) => {
  try {
    const history = marketplaceStore.getPaymentHistory(req.user.id);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- REVIEWS ---
export const createReview = (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Booking ID, rating, and comment are required.' });
    }

    const result = marketplaceStore.addReview({
      bookingId,
      customerId: req.user.id,
      rating,
      comment,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      data: result.review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderReviews = (req, res) => {
  try {
    const reviews = marketplaceStore.getReviewsByProvider(req.params.providerId);
    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReviews = (req, res) => {
  try {
    const reviews = marketplaceStore.getAllReviews();
    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- ADMIN ---
export const getAdminDashboard = (req, res) => {
  try {
    const stats = marketplaceStore.getAdminStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminUsers = (req, res) => {
  try {
    const users = marketplaceStore.users.map((u) => {
      const { passwordHash, ...safe } = u;
      return safe;
    });
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = (req, res) => {
  try {
    const { isActive } = req.body;
    const updated = marketplaceStore.updateUser(req.params.id, { isActive });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminProviders = (req, res) => {
  try {
    const providers = marketplaceStore.getAllProviders();
    return res.status(200).json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProviderVerification = (req, res) => {
  try {
    const { verificationStatus } = req.body; // 'approved' | 'rejected' | 'pending'
    const updated = marketplaceStore.updateProviderProfile(req.params.userId, { verificationStatus });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminBookings = (req, res) => {
  try {
    const bookings = marketplaceStore.getAllBookings();
    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- NOTIFICATIONS ---
export const getNotifications = (req, res) => {
  try {
    const notifs = marketplaceStore.getUserNotifications(req.user.id);
    return res.status(200).json({ success: true, count: notifs.length, data: notifs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = (req, res) => {
  try {
    const updated = marketplaceStore.markNotificationRead(req.params.id);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = (req, res) => {
  try {
    marketplaceStore.markAllNotificationsRead(req.user.id);
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetDatabase = (req, res) => {
  try {
    marketplaceStore.resetToDefaults();
    return res.status(200).json({ success: true, message: 'Database reset to initial sample state successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
