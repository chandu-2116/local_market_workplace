/**
 * UrbanFix Data Store & In-Memory Persistence Layer
 * Provides thread-safe, atomic operations for bookings, multi-role state,
 * and notifications, while supporting disk-backup.
 */

import fs from 'fs';
import path from 'path';
import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_PROVIDER_PROFILES,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '../seed/initialData.js';

const DATA_FILE = path.resolve(process.cwd(), '.marketplace_data.json');

class MarketplaceStore {
  constructor() {
    this.categories = [];
    this.users = [];
    this.providerProfiles = [];
    this.services = [];
    this.bookings = [];
    this.reviews = [];
    this.notifications = [];
    this.payments = [];
    this.bookingLocks = new Set();
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.categories = parsed.categories || INITIAL_CATEGORIES;
        this.users = parsed.users || INITIAL_USERS;
        this.providerProfiles = parsed.providerProfiles || INITIAL_PROVIDER_PROFILES;
        this.services = parsed.services || INITIAL_SERVICES;
        this.bookings = parsed.bookings || INITIAL_BOOKINGS;
        this.reviews = parsed.reviews || INITIAL_REVIEWS;
        this.notifications = parsed.notifications || INITIAL_NOTIFICATIONS;
        this.payments = parsed.payments || [];
        return;
      }
    } catch {
      // fallback to initial data
    }
    this.resetToDefaults();
  }

  save() {
    try {
      const state = {
        categories: this.categories,
        users: this.users,
        providerProfiles: this.providerProfiles,
        services: this.services,
        bookings: this.bookings,
        reviews: this.reviews,
        notifications: this.notifications,
        payments: this.payments,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch {
      // ignore in read-only sandbox
    }
  }

  resetToDefaults() {
    this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.providerProfiles = JSON.parse(JSON.stringify(INITIAL_PROVIDER_PROFILES));
    this.services = JSON.parse(JSON.stringify(INITIAL_SERVICES));
    this.bookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
    this.reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.payments = [];
    this.save();
  }

  // --- Auth & Users ---
  getUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  createUser(userData) {
    const id = `usr-${Date.now()}`;
    const newUser = {
      id,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.password,
      phone: userData.phone || '',
      role: userData.role || 'customer',
      avatar: userData.avatar || (userData.role === 'provider'
        ? '/src/assets/images/provider_profile_avatar_1793379954226.jpg'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'),
      isActive: true,
      address: userData.address || {
        street: '123 Market St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);

    if (newUser.role === 'provider') {
      const profile = {
        id: `prof-${Date.now()}`,
        userId: newUser.id,
        businessName: userData.businessName || `${newUser.name} Services`,
        bio: userData.bio || 'Professional and verified service provider dedicated to quality craftsmanship.',
        categoryIds: userData.categoryIds || ['cat-1'],
        experienceYears: Number(userData.experienceYears) || 3,
        hourlyRate: Number(userData.hourlyRate) || 50,
        isVerified: false,
        verificationStatus: 'pending',
        rating: 5.0,
        reviewCount: 0,
        totalJobsCompleted: 0,
        totalEarnings: 0,
        isAvailable: true,
        serviceRadiusKm: 25,
        documents: [
          {
            name: 'Identification_and_Trade_License.pdf',
            url: '#',
            status: 'pending',
            uploadedAt: new Date().toISOString(),
          },
        ],
      };
      this.providerProfiles.push(profile);
    }

    this.save();
    const { passwordHash, ...safe } = newUser;
    return safe;
  }

  updateUser(id, updates) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.avatar) user.avatar = updates.avatar;
    if (updates.address) user.address = { ...user.address, ...updates.address };
    if (typeof updates.isActive === 'boolean') user.isActive = updates.isActive;
    this.save();
    const { passwordHash, ...safe } = user;
    return safe;
  }

  // --- Provider Profiles ---
  getProviderProfileByUserId(userId) {
    return this.providerProfiles.find((p) => p.userId === userId);
  }

  getAllProviders() {
    return this.providerProfiles.map((p) => {
      const user = this.getUserById(p.userId);
      const categories = this.categories.filter((c) => p.categoryIds?.includes(c.id));
      return {
        ...p,
        user,
        categories,
      };
    });
  }

  updateProviderProfile(userId, updates) {
    const profile = this.providerProfiles.find((p) => p.userId === userId);
    if (!profile) return null;
    if (updates.businessName) profile.businessName = updates.businessName;
    if (updates.bio) profile.bio = updates.bio;
    if (updates.hourlyRate) profile.hourlyRate = Number(updates.hourlyRate);
    if (updates.experienceYears) profile.experienceYears = Number(updates.experienceYears);
    if (updates.categoryIds) profile.categoryIds = updates.categoryIds;
    if (typeof updates.isAvailable === 'boolean') profile.isAvailable = updates.isAvailable;
    if (updates.serviceRadiusKm) profile.serviceRadiusKm = Number(updates.serviceRadiusKm);
    if (updates.verificationStatus) {
      profile.verificationStatus = updates.verificationStatus;
      profile.isVerified = updates.verificationStatus === 'approved';
    }
    this.save();
    return profile;
  }

  // --- Categories ---
  getCategories() {
    return this.categories;
  }

  getCategoryBySlug(slug) {
    return this.categories.find((c) => c.slug === slug || c.id === slug);
  }

  createCategory(data) {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      iconName: data.iconName || 'Wrench',
      image: data.image || '/src/assets/images/urbanfix_hero_banner_1793379908387.jpg',
      description: data.description || '',
      servicesCount: 0,
      isActive: true,
    };
    this.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id, updates) {
    const cat = this.categories.find((c) => c.id === id);
    if (!cat) return null;
    Object.assign(cat, updates);
    this.save();
    return cat;
  }

  deleteCategory(id) {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Services ---
  getServices(filter = {}) {
    let result = [...this.services];
    if (filter.categoryId) {
      result = result.filter((s) => s.categoryId === filter.categoryId);
    }
    if (filter.providerUserId) {
      result = result.filter((s) => s.providerUserId === filter.providerUserId);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    if (filter.minPrice !== undefined) {
      result = result.filter((s) => s.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice !== undefined) {
      result = result.filter((s) => s.price <= Number(filter.maxPrice));
    }
    if (filter.minRating !== undefined) {
      result = result.filter((s) => s.rating >= Number(filter.minRating));
    }

    // Hydrate with category and provider details
    return result.map((s) => this.hydrateService(s));
  }

  getServiceById(id) {
    const service = this.services.find((s) => s.id === id || s.slug === id);
    if (!service) return null;
    return this.hydrateService(service);
  }

  hydrateService(s) {
    const category = this.categories.find((c) => c.id === s.categoryId);
    const providerUser = this.getUserById(s.providerUserId);
    const providerProfile = this.getProviderProfileByUserId(s.providerUserId);
    return {
      ...s,
      category,
      provider: providerUser
        ? {
            ...providerUser,
            profile: providerProfile,
          }
        : null,
    };
  }

  createService(data, providerUserId) {
    const id = `srv-${Date.now()}`;
    const newService = {
      id,
      title: data.title,
      slug: (data.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now()}`,
      categoryId: data.categoryId,
      providerUserId,
      description: data.description,
      price: Number(data.price),
      priceType: data.priceType || 'fixed',
      durationEstimate: data.durationEstimate || '1-2 hours',
      image: data.image || '/src/assets/images/service_plumbing_electrical_1793379941310.jpg',
      rating: 5.0,
      reviewCount: 0,
      features: Array.isArray(data.features) ? data.features : ['Quality Assured', 'Certified Professional'],
      isPopular: false,
      isActive: true,
    };
    this.services.push(newService);

    // Increment category services count
    const cat = this.categories.find((c) => c.id === data.categoryId);
    if (cat) cat.servicesCount = (cat.servicesCount || 0) + 1;

    this.save();
    return this.hydrateService(newService);
  }

  updateService(id, updates, providerUserId) {
    const service = this.services.find((s) => s.id === id);
    if (!service) return null;
    if (providerUserId && service.providerUserId !== providerUserId) {
      return { error: 'UNAUTHORIZED' };
    }
    Object.assign(service, updates);
    this.save();
    return this.hydrateService(service);
  }

  deleteService(id, providerUserId) {
    const idx = this.services.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    const service = this.services[idx];
    if (providerUserId && service.providerUserId !== providerUserId) {
      return false;
    }
    this.services.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Bookings & Atomic Acceptance Engine ---
  hydrateBooking(b) {
    const customer = this.getUserById(b.customerId);
    const service = this.services.find((s) => s.id === b.serviceId);
    const category = this.categories.find((c) => c.id === b.categoryId || c.id === service?.categoryId);
    const assignedProviderUser = b.assignedProviderId ? this.getUserById(b.assignedProviderId) : null;
    const assignedProviderProfile = b.assignedProviderId ? this.getProviderProfileByUserId(b.assignedProviderId) : null;

    return {
      ...b,
      customer,
      service: service ? this.hydrateService(service) : null,
      category,
      assignedProvider: assignedProviderUser
        ? {
            ...assignedProviderUser,
            profile: assignedProviderProfile,
          }
        : null,
    };
  }

  getBookingById(id) {
    const booking = this.bookings.find((b) => b.id === id || b.bookingNumber === id);
    if (!booking) return null;
    return this.hydrateBooking(booking);
  }

  getCustomerBookings(customerId) {
    return this.bookings
      .filter((b) => b.customerId === customerId)
      .map((b) => this.hydrateBooking(b))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * For Service Providers:
   * 1. Incoming requests: Status is 'Pending' AND belongs to categories the provider serves AND not rejected by this provider.
   * 2. My Bookings: Assigned to this provider (Accepted, Work Started, Completed).
   */
  getProviderRequests(providerUserId) {
    const profile = this.getProviderProfileByUserId(providerUserId);
    const servedCategories = profile?.categoryIds || [];

    const pendingRequests = this.bookings
      .filter((b) => {
        if (b.status !== 'Pending') return false;
        // Not already assigned
        if (b.assignedProviderId) return false;
        // Provider has not rejected this request
        if (b.rejectedByProviders?.includes(providerUserId)) return false;
        // Belongs to served category or matches service provider
        const service = this.services.find((s) => s.id === b.serviceId);
        const catId = b.categoryId || service?.categoryId;
        return servedCategories.length === 0 || servedCategories.includes(catId);
      })
      .map((b) => this.hydrateBooking(b));

    const assignedJobs = this.bookings
      .filter((b) => b.assignedProviderId === providerUserId)
      .map((b) => this.hydrateBooking(b))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      pendingRequests,
      assignedJobs,
    };
  }

  getAllBookings() {
    return this.bookings
      .map((b) => this.hydrateBooking(b))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createBooking(data, customerId) {
    const service = this.services.find((s) => s.id === data.serviceId);
    if (!service) throw new Error('Service not found');

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingNumber = `UBF-${randomSuffix}`;
    const id = `bk-${Date.now()}`;

    const newBooking = {
      id,
      bookingNumber,
      customerId,
      serviceId: service.id,
      categoryId: service.categoryId,
      assignedProviderId: null, // Starts in the open provider pool
      rejectedByProviders: [],
      status: 'Pending',
      problemDescription: data.problemDescription,
      serviceAddress: data.serviceAddress,
      scheduledDate: data.scheduledDate,
      scheduledTimeSlot: data.scheduledTimeSlot,
      amount: service.price,
      paymentStatus: 'Pending',
      paymentMethod: 'None',
      paymentId: '',
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: customerId,
          note: 'Service request created and broadcast to local service providers.',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(newBooking);

    // Broadcast notification to eligible providers
    const eligibleProviders = this.providerProfiles.filter(
      (p) => p.categoryIds?.includes(service.categoryId) && p.isAvailable
    );
    eligibleProviders.forEach((p) => {
      this.createNotification({
        recipientId: p.userId,
        title: 'New Service Request',
        message: `New request #${bookingNumber} in ${service.title}: "${data.problemDescription.slice(0, 70)}..."`,
        type: 'booking_request',
        link: '/provider/dashboard',
      });
    });

    this.save();
    return this.hydrateBooking(newBooking);
  }

  /**
   * ATOMIC ACCEPTANCE ENGINE:
   * Prevents race conditions. If another provider claims the booking first, returns ALREADY_ACCEPTED.
   */
  acceptBooking(bookingId, providerUserId) {
    if (this.bookingLocks.has(bookingId)) {
      return { success: false, reason: 'LOCKED', message: 'Request is being processed by another provider.' };
    }

    try {
      this.bookingLocks.add(bookingId);
      const booking = this.bookings.find((b) => b.id === bookingId);
      if (!booking) {
        return { success: false, reason: 'NOT_FOUND', message: 'Booking not found.' };
      }

      if (booking.status !== 'Pending' || booking.assignedProviderId !== null) {
        return {
          success: false,
          reason: 'ALREADY_ACCEPTED',
          message: 'This request has already been accepted by another service provider.',
        };
      }

      const providerUser = this.getUserById(providerUserId);
      const providerProfile = this.getProviderProfileByUserId(providerUserId);

      // Atomic state change
      booking.status = 'Accepted';
      booking.assignedProviderId = providerUserId;
      booking.statusHistory.push({
        status: 'Accepted',
        updatedBy: providerUserId,
        note: `${providerProfile?.businessName || providerUser?.name || 'Provider'} accepted the job and confirmed availability.`,
        timestamp: new Date().toISOString(),
      });

      // Notify customer
      this.createNotification({
        recipientId: booking.customerId,
        title: 'Provider Confirmed!',
        message: `${providerUser?.name || 'A specialist'} accepted your booking #${booking.bookingNumber}. Scheduled for ${booking.scheduledDate} (${booking.scheduledTimeSlot}).`,
        type: 'booking_accepted',
        link: '/customer/dashboard',
      });

      this.save();
      return { success: true, booking: this.hydrateBooking(booking) };
    } finally {
      this.bookingLocks.delete(bookingId);
    }
  }

  rejectBooking(bookingId, providerUserId) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;
    if (!booking.rejectedByProviders) {
      booking.rejectedByProviders = [];
    }
    if (!booking.rejectedByProviders.includes(providerUserId)) {
      booking.rejectedByProviders.push(providerUserId);
    }
    this.save();
    return { success: true };
  }

  startWork(bookingId, providerUserId) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };
    if (booking.assignedProviderId !== providerUserId) {
      return { success: false, message: 'Unauthorized for this booking' };
    }
    if (booking.status !== 'Accepted') {
      return { success: false, message: `Cannot start work from status ${booking.status}` };
    }

    booking.status = 'Work Started';
    booking.statusHistory.push({
      status: 'Work Started',
      updatedBy: providerUserId,
      note: 'Provider arrived on site and commenced work.',
      timestamp: new Date().toISOString(),
    });

    this.createNotification({
      recipientId: booking.customerId,
      title: 'Work Started',
      message: `Your service provider has arrived and started work on booking #${booking.bookingNumber}.`,
      type: 'booking_started',
      link: '/customer/dashboard',
    });

    this.save();
    return { success: true, booking: this.hydrateBooking(booking) };
  }

  completeWork(bookingId, providerUserId) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };
    if (booking.assignedProviderId !== providerUserId) {
      return { success: false, message: 'Unauthorized for this booking' };
    }

    booking.status = 'Completed';
    booking.statusHistory.push({
      status: 'Completed',
      updatedBy: providerUserId,
      note: 'Service completed. Ready for payment and customer review.',
      timestamp: new Date().toISOString(),
    });

    // Update provider profile stats
    const profile = this.getProviderProfileByUserId(providerUserId);
    if (profile) {
      profile.totalJobsCompleted = (profile.totalJobsCompleted || 0) + 1;
    }

    this.createNotification({
      recipientId: booking.customerId,
      title: 'Service Completed',
      message: `Your service #${booking.bookingNumber} is marked complete! Please complete payment and leave a review.`,
      type: 'booking_completed',
      link: '/customer/dashboard',
    });

    this.save();
    return { success: true, booking: this.hydrateBooking(booking) };
  }

  cancelBooking(bookingId, userId) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };
    if (booking.status === 'Completed') {
      return { success: false, message: 'Completed bookings cannot be cancelled.' };
    }

    booking.status = 'Cancelled';
    booking.statusHistory.push({
      status: 'Cancelled',
      updatedBy: userId,
      note: 'Booking cancelled.',
      timestamp: new Date().toISOString(),
    });

    if (booking.assignedProviderId) {
      this.createNotification({
        recipientId: booking.assignedProviderId,
        title: 'Booking Cancelled',
        message: `Booking #${booking.bookingNumber} was cancelled.`,
        type: 'system',
        link: '/provider/dashboard',
      });
    }

    this.save();
    return { success: true, booking: this.hydrateBooking(booking) };
  }

  // --- Payments ---
  processPayment({ bookingId, customerId, amount, paymentMethod, razorpayPaymentId }) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    const transactionId = `txn_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    booking.paymentStatus = 'Paid';
    booking.paymentMethod = paymentMethod || 'Razorpay';
    booking.paymentId = razorpayPaymentId || `pay_rzp_mock_${Date.now()}`;

    const paymentRecord = {
      id: `pmt-${Date.now()}`,
      bookingId,
      customerId,
      providerId: booking.assignedProviderId,
      amount: amount || booking.amount,
      currency: 'USD',
      status: 'Success',
      transactionId,
      razorpayOrderId: `order_${Date.now()}`,
      razorpayPaymentId: booking.paymentId,
      paymentMethod: booking.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    this.payments.push(paymentRecord);

    // Credit earnings to provider profile
    if (booking.assignedProviderId) {
      const profile = this.getProviderProfileByUserId(booking.assignedProviderId);
      if (profile) {
        profile.totalEarnings = (profile.totalEarnings || 0) + (amount || booking.amount);
      }
      this.createNotification({
        recipientId: booking.assignedProviderId,
        title: 'Payment Received',
        message: `Payment of $${amount || booking.amount} received for booking #${booking.bookingNumber}.`,
        type: 'payment_received',
        link: '/provider/dashboard',
      });
    }

    this.save();
    return {
      success: true,
      payment: paymentRecord,
      booking: this.hydrateBooking(booking),
    };
  }

  getPaymentHistory(userId) {
    return this.payments.filter((p) => p.customerId === userId || p.providerId === userId);
  }

  // --- Reviews ---
  addReview({ bookingId, customerId, rating, comment }) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };
    if (!booking.assignedProviderId) {
      return { success: false, message: 'No provider assigned to review' };
    }

    // Check duplicate review
    const existing = this.reviews.find((r) => r.bookingId === bookingId);
    if (existing) {
      return { success: false, message: 'Review has already been submitted for this booking' };
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      bookingId,
      customerId,
      providerId: booking.assignedProviderId,
      serviceId: booking.serviceId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);

    // Recompute provider rating
    const providerReviews = this.reviews.filter((r) => r.providerId === booking.assignedProviderId);
    const avgRating =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
    const profile = this.getProviderProfileByUserId(booking.assignedProviderId);
    if (profile) {
      profile.rating = Number(avgRating.toFixed(2));
      profile.reviewCount = providerReviews.length;
    }

    // Notify provider
    this.createNotification({
      recipientId: booking.assignedProviderId,
      title: 'New Customer Review',
      message: `You received a ${rating}-star review for booking #${booking.bookingNumber}: "${comment.slice(0, 60)}..."`,
      type: 'review_submitted',
      link: '/provider/dashboard',
    });

    this.save();
    return { success: true, review: newReview };
  }

  getReviewsByProvider(providerId) {
    return this.reviews
      .filter((r) => r.providerId === providerId)
      .map((r) => {
        const customer = this.getUserById(r.customerId);
        const service = this.services.find((s) => s.id === r.serviceId);
        return {
          ...r,
          customer,
          service,
        };
      });
  }

  getAllReviews() {
    return this.reviews.map((r) => {
      const customer = this.getUserById(r.customerId);
      const provider = this.getUserById(r.providerId);
      const service = this.services.find((s) => s.id === r.serviceId);
      return {
        ...r,
        customer,
        provider,
        service,
      };
    });
  }

  // --- Notifications ---
  createNotification(data) {
    const notif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientId: data.recipientId,
      senderId: data.senderId || null,
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      link: data.link || '',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    this.save();
    return notif;
  }

  getUserNotifications(userId) {
    return this.notifications.filter((n) => n.recipientId === userId);
  }

  markNotificationRead(id) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId) {
    this.notifications.forEach((n) => {
      if (n.recipientId === userId) n.isRead = true;
    });
    this.save();
  }

  // --- Admin Analytics ---
  getAdminStats() {
    const totalCustomers = this.users.filter((u) => u.role === 'customer').length;
    const totalProviders = this.users.filter((u) => u.role === 'provider').length;
    const totalServices = this.services.length;
    const totalBookings = this.bookings.length;

    const totalRevenue = this.payments.reduce((sum, p) => sum + (p.amount || 0), 0) +
      this.bookings
        .filter((b) => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    const pendingApprovals = this.providerProfiles.filter(
      (p) => p.verificationStatus === 'pending'
    ).length;

    const bookingStatusCounts = {
      Pending: this.bookings.filter((b) => b.status === 'Pending').length,
      Accepted: this.bookings.filter((b) => b.status === 'Accepted').length,
      'Work Started': this.bookings.filter((b) => b.status === 'Work Started').length,
      Completed: this.bookings.filter((b) => b.status === 'Completed').length,
      Cancelled: this.bookings.filter((b) => b.status === 'Cancelled').length,
    };

    return {
      totalCustomers,
      totalProviders,
      totalServices,
      totalBookings,
      totalRevenue,
      pendingApprovals,
      bookingStatusCounts,
      recentUsers: this.users.slice(-6).map((u) => this.getUserById(u.id)),
      recentBookings: this.bookings.slice(0, 6).map((b) => this.hydrateBooking(b)),
    };
  }
}

export const marketplaceStore = new MarketplaceStore();
