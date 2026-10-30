/**
 * UrbanFix Customer Dashboard
 * Displays full booking history, live provider tracking, payment execution, and reviews.
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Star,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useMarketplace } from '../context/MarketplaceContext.jsx';
import PaymentModal from '../components/payment/PaymentModal.jsx';
import ReviewModal from '../components/review/ReviewModal.jsx';

export default function CustomerDashboard() {
  const { user, updateProfile } = useAuth();
  const { customerBookings, fetchCustomerBookings, cancelBooking } = useMarketplace();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile'
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'NY',
    zipCode: user?.address?.zipCode || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    fetchCustomerBookings();
  }, [fetchCustomerBookings]);

  // Calculations for dashboard summary metrics
  const totalBookings = customerBookings.length;
  const pendingRequests = customerBookings.filter((b) => b.status === 'Pending').length;
  const activeBookings = customerBookings.filter(
    (b) => b.status === 'Accepted' || b.status === 'Work Started'
  ).length;
  const completedBookings = customerBookings.filter((b) => b.status === 'Completed').length;
  const totalSpent = customerBookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: profileData.name,
      phone: profileData.phone,
      address: {
        street: profileData.street,
        city: profileData.city,
        state: profileData.state,
        zipCode: profileData.zipCode,
      },
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">Pending Acceptance</span>;
      case 'Accepted':
        return <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">Provider Assigned</span>;
      case 'Work Started':
        return <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">Work In Progress</span>;
      case 'Completed':
        return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">Completed</span>;
      case 'Cancelled':
        return <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Cancelled</span>;
      default:
        return <span className="text-xs text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Customer Portal</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome, {user?.name || 'Customer'}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your service appointments, track assigned specialists, and review past visits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/services"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Book New Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Total Bookings</div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">{totalBookings}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Pending Request Pool</div>
            <div className="text-2xl font-bold text-amber-600 mt-2 tabular-nums">{pendingRequests}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Active / In Progress</div>
            <div className="text-2xl font-bold text-indigo-600 mt-2 tabular-nums">{activeBookings}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Completed Jobs</div>
            <div className="text-2xl font-bold text-emerald-600 mt-2 tabular-nums">{completedBookings}</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Total Amount Spent</div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">${totalSpent}</div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'bookings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            My Bookings & Service History ({customerBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Profile & Address Book
          </button>
        </div>

        {/* TAB 1: Bookings List */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {customerBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Bookings Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You haven't requested any services yet. Explore our 15 service categories and book a verified local technician.
                </p>
                <Link
                  to="/services"
                  className="inline-block px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
                >
                  Explore Services
                </Link>
              </div>
            ) : (
              customerBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">#{booking.bookingNumber}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          Created {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {booking.service?.title || 'Home Service'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.status)}
                      <span className="text-lg font-bold text-slate-900 tabular-nums">${booking.amount}</span>
                    </div>
                  </div>

                  {/* Booking details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Schedule & Problem */}
                    <div className="space-y-3 md:col-span-2">
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="font-semibold text-slate-900 mb-1">Service Request Notes:</div>
                        <p className="text-slate-600 leading-relaxed">{booking.problemDescription}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Date: <strong className="text-slate-900">{booking.scheduledDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Slot: <strong className="text-slate-900">{booking.scheduledTimeSlot}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Location: {booking.serviceAddress?.street}, {booking.serviceAddress?.city}</span>
                        </div>
                      </div>

                      {/* Status Stepper Timeline */}
                      <div className="pt-2">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Live Progress Tracker
                        </div>
                        <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                          
                          {['Pending', 'Accepted', 'Work Started', 'Completed'].map((step, idx) => {
                            const stepsOrder = ['Pending', 'Accepted', 'Work Started', 'Completed'];
                            const currentIdx = stepsOrder.indexOf(booking.status);
                            const isDone = currentIdx >= idx;
                            const isCurrent = booking.status === step;

                            return (
                              <div key={step} className="relative z-10 flex flex-col items-center bg-white px-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isDone
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${isCurrent ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Assigned Provider or Pending Pool Notice */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                      {booking.assignedProvider ? (
                        <div className="space-y-3">
                          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Assigned Specialist
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.assignedProvider.avatar || '/src/assets/images/provider_profile_avatar_1793379954226.jpg'}
                              alt={booking.assignedProvider.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                <span>{booking.assignedProvider.name}</span>
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {booking.assignedProvider.profile?.businessName || 'Verified Specialist'}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{booking.assignedProvider.profile?.rating || '4.9'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{booking.assignedProvider.phone || '+1 (555) 019-2831'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 py-2">
                          <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                            Broadcast in Provider Pool
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Eligible specialists are reviewing your request. As soon as a provider confirms, their credentials and live contact will appear here.
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-slate-200 space-y-2">
                        {/* Payment Button if completed & unpaid */}
                        {booking.status === 'Completed' && booking.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => setSelectedBookingForPayment(booking)}
                            className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay ${booking.amount} via Razorpay</span>
                          </button>
                        )}

                        {/* Payment status badge if paid */}
                        {booking.paymentStatus === 'Paid' && (
                          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-between">
                            <span>Paid in Full</span>
                            <span className="text-[11px] text-emerald-600">{booking.paymentMethod}</span>
                          </div>
                        )}

                        {/* Review button if completed */}
                        {booking.status === 'Completed' && (
                          <button
                            onClick={() => setSelectedBookingForReview(booking)}
                            className="w-full py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>Leave Rating & Review</span>
                          </button>
                        )}

                        {/* Cancel button if pending */}
                        {booking.status === 'Pending' && (
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to cancel this service request?')) {
                                await cancelBooking(booking.id);
                              }
                            }}
                            className="w-full py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Customer Profile & Address</h2>
            <p className="text-xs text-slate-500 mb-6">
              Your default contact details and service address for speedy future bookings.
            </p>

            {profileSaved && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Phone</label>
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={profileData.street}
                  onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={profileData.state}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    required
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedBookingForPayment && (
        <PaymentModal
          booking={selectedBookingForPayment}
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onSuccess={() => {
            setSelectedBookingForPayment(null);
            fetchCustomerBookings();
          }}
        />
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          isOpen={!!selectedBookingForReview}
          onClose={() => setSelectedBookingForReview(null)}
          onSuccess={() => {
            setSelectedBookingForReview(null);
            fetchCustomerBookings();
          }}
        />
      )}
    </div>
  );
}
