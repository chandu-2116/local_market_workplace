/**
 * Bookings Controller for UrbanFix
 * Handles end-to-end booking lifecycle and atomic acceptance.
 */
import { marketplaceStore } from '../data/store.js';

export const createBooking = (req, res) => {
  try {
    const { serviceId, problemDescription, serviceAddress, scheduledDate, scheduledTimeSlot } = req.body;

    if (!serviceId || !problemDescription || !serviceAddress || !scheduledDate || !scheduledTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all booking details: service, problem description, address, date, and time slot.',
      });
    }

    const booking = marketplaceStore.createBooking(
      { serviceId, problemDescription, serviceAddress, scheduledDate, scheduledTimeSlot },
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: 'Service request created successfully and broadcast to eligible providers.',
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = (req, res) => {
  try {
    const bookings = marketplaceStore.getCustomerBookings(req.user.id);
    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderRequests = (req, res) => {
  try {
    const { pendingRequests, assignedJobs } = marketplaceStore.getProviderRequests(req.user.id);
    return res.status(200).json({
      success: true,
      data: {
        pendingRequests,
        assignedJobs,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = (req, res) => {
  try {
    const booking = marketplaceStore.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role check: Admin, or customer owner, or assigned provider, or eligible provider viewing pending
    const isCustomer = booking.customerId === req.user.id;
    const isAssigned = booking.assignedProviderId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isPendingProvider = req.user.role === 'provider' && booking.status === 'Pending';

    if (!isCustomer && !isAssigned && !isAdmin && !isPendingProvider) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptBooking = (req, res) => {
  try {
    const result = marketplaceStore.acceptBooking(req.params.id, req.user.id);
    if (!result.success) {
      if (result.reason === 'ALREADY_ACCEPTED') {
        return res.status(409).json({
          success: false,
          code: 'ALREADY_ACCEPTED',
          message: 'This request has already been accepted by another service provider.',
        });
      }
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking successfully accepted and assigned to you!',
      data: result.booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectBooking = (req, res) => {
  try {
    marketplaceStore.rejectBooking(req.params.id, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Request dismissed from your incoming list.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const startBooking = (req, res) => {
  try {
    const result = marketplaceStore.startWork(req.params.id, req.user.id);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({
      success: true,
      message: 'Work status updated to "Work Started".',
      data: result.booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const completeBooking = (req, res) => {
  try {
    const result = marketplaceStore.completeWork(req.params.id, req.user.id);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({
      success: true,
      message: 'Job marked as completed. Customer notified for review & payment.',
      data: result.booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = (req, res) => {
  try {
    const result = marketplaceStore.cancelBooking(req.params.id, req.user.id);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: result.booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
