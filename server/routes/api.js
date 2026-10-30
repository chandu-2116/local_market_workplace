/**
 * Express REST API Routes for UrbanFix
 */
import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';
import * as svcCtrl from '../controllers/servicesController.js';
import * as bkCtrl from '../controllers/bookingsController.js';
import * as admCtrl from '../controllers/adminController.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authenticate, authCtrl.getMe);
router.put('/auth/profile', authenticate, authCtrl.updateProfile);

// --- Services Routes ---
router.get('/services', svcCtrl.getServices);
router.get('/services/:id', svcCtrl.getServiceById);
router.post('/services', authenticate, authorize('provider', 'admin'), svcCtrl.createService);
router.put('/services/:id', authenticate, authorize('provider', 'admin'), svcCtrl.updateService);
router.delete('/services/:id', authenticate, authorize('provider', 'admin'), svcCtrl.deleteService);

// --- Categories Routes ---
router.get('/categories', svcCtrl.getCategories);
router.post('/categories', authenticate, authorize('admin'), svcCtrl.createCategory);
router.put('/categories/:id', authenticate, authorize('admin'), svcCtrl.updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), svcCtrl.deleteCategory);

// --- Bookings Routes ---
router.post('/bookings', authenticate, bkCtrl.createBooking);
router.get('/bookings/my-bookings', authenticate, bkCtrl.getMyBookings);
router.get('/bookings/provider-requests', authenticate, authorize('provider'), bkCtrl.getProviderRequests);
router.get('/bookings/:id', authenticate, bkCtrl.getBookingById);
router.patch('/bookings/:id/accept', authenticate, authorize('provider'), bkCtrl.acceptBooking);
router.patch('/bookings/:id/reject', authenticate, authorize('provider'), bkCtrl.rejectBooking);
router.patch('/bookings/:id/start', authenticate, authorize('provider'), bkCtrl.startBooking);
router.patch('/bookings/:id/complete', authenticate, authorize('provider'), bkCtrl.completeBooking);
router.patch('/bookings/:id/cancel', authenticate, bkCtrl.cancelBooking);

// --- Payments Routes ---
router.post('/payments/create-order', authenticate, admCtrl.createPaymentOrder);
router.post('/payments/verify', authenticate, admCtrl.verifyPayment);
router.get('/payments/history', authenticate, admCtrl.getPaymentHistory);

// --- Reviews Routes ---
router.post('/reviews', authenticate, admCtrl.createReview);
router.get('/reviews/provider/:providerId', admCtrl.getProviderReviews);
router.get('/reviews', authenticate, authorize('admin'), admCtrl.getAllReviews);

// --- Admin Routes ---
router.get('/admin/dashboard', authenticate, authorize('admin'), admCtrl.getAdminDashboard);
router.get('/admin/users', authenticate, authorize('admin'), admCtrl.getAdminUsers);
router.patch('/admin/users/:id/status', authenticate, authorize('admin'), admCtrl.toggleUserStatus);
router.get('/admin/providers', authenticate, authorize('admin'), admCtrl.getAdminProviders);
router.patch('/admin/providers/:userId/verify', authenticate, authorize('admin'), admCtrl.updateProviderVerification);
router.get('/admin/bookings', authenticate, authorize('admin'), admCtrl.getAdminBookings);
router.post('/admin/reset-data', authenticate, authorize('admin'), admCtrl.resetDatabase);

// --- Notifications Routes ---
router.get('/notifications', authenticate, admCtrl.getNotifications);
router.patch('/notifications/:id/read', authenticate, admCtrl.markNotificationRead);
router.patch('/notifications/read-all', authenticate, admCtrl.markAllNotificationsRead);

export default router;
