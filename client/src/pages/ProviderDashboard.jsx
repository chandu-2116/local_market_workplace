/**
 * UrbanFix Service Provider Dashboard
 * Features atomic customer request acceptance, active job status updates,
 * earnings analytics, and service listing management.
 */
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  Play,
  CheckCheck,
  ShieldCheck,
  AlertCircle,
  Plus,
  Briefcase,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useMarketplace } from '../context/MarketplaceContext.jsx';
import api from '../services/api.js';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const {
    categories,
    pendingRequests,
    assignedJobs,
    fetchProviderBookings,
    acceptBooking,
    rejectBooking,
    startWork,
    completeWork,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'active' | 'completed' | 'services'
  const [actionLoading, setActionLoading] = useState('');
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [isAvailable, setIsAvailable] = useState(user?.profile?.isAvailable ?? true);

  // Add Service Form Modal
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    categoryId: categories[0]?.id || 'cat-1',
    description: '',
    price: '',
    durationEstimate: '1-2 hours',
  });

  useEffect(() => {
    fetchProviderBookings();
  }, [fetchProviderBookings]);

  // Provider metrics
  const activeJobs = assignedJobs.filter(
    (j) => j.status === 'Accepted' || j.status === 'Work Started'
  );
  const completedJobs = assignedJobs.filter((j) => j.status === 'Completed');
  const totalEarnings = completedJobs.reduce((sum, j) => sum + (j.amount || 0), 0) + (user?.profile?.totalEarnings || 0);
  const rating = user?.profile?.rating || 4.94;
  const reviewCount = user?.profile?.reviewCount || 138;

  // Handle Atomic Accept
  const handleAccept = async (bookingId) => {
    setActionLoading(`accept-${bookingId}`);
    setErrorBanner('');
    setSuccessBanner('');

    const res = await acceptBooking(bookingId);
    if (res.success) {
      setSuccessBanner(`Booking #${res.booking.bookingNumber} successfully assigned to you!`);
      setActiveTab('active');
    } else {
      if (res.code === 'ALREADY_ACCEPTED') {
        setErrorBanner('Request taken: Another specialist already accepted this job seconds ago.');
      } else {
        setErrorBanner(res.message || 'Failed to accept request.');
      }
    }
    setActionLoading('');
  };

  // Handle Decline
  const handleReject = async (bookingId) => {
    setActionLoading(`reject-${bookingId}`);
    await rejectBooking(bookingId);
    setActionLoading('');
  };

  // Handle Start Work
  const handleStartWork = async (bookingId) => {
    setActionLoading(`start-${bookingId}`);
    const res = await startWork(bookingId);
    if (res.success) {
      setSuccessBanner('Status updated: Work Started. Customer notified.');
    } else {
      setErrorBanner(res.message || 'Could not update work status.');
    }
    setActionLoading('');
  };

  // Handle Complete Work
  const handleCompleteWork = async (bookingId) => {
    setActionLoading(`complete-${bookingId}`);
    const res = await completeWork(bookingId);
    if (res.success) {
      setSuccessBanner('Job Completed! Customer has been requested to submit payment and review.');
      setActiveTab('completed');
    } else {
      setErrorBanner(res.message || 'Could not complete job.');
    }
    setActionLoading('');
  };

  // Toggle Availability
  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    try {
      await api.put('/auth/profile', { isAvailable: nextVal });
    } catch {
      // rollback
      setIsAvailable(!nextVal);
    }
  };

  // Create new service
  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', {
        title: newService.title,
        categoryId: newService.categoryId,
        description: newService.description,
        price: Number(newService.price),
        durationEstimate: newService.durationEstimate,
        image: '/src/assets/images/service_plumbing_electrical_1793379941310.jpg',
      });
      setShowAddService(false);
      setSuccessBanner(`New service "${newService.title}" listed successfully!`);
      setNewService({
        title: '',
        categoryId: categories[0]?.id || 'cat-1',
        description: '',
        price: '',
        durationEstimate: '1-2 hours',
      });
    } catch (err) {
      setErrorBanner(err.response?.data?.message || 'Failed to list service');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Provider Profile Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || '/src/assets/images/provider_profile_avatar_1793379954226.jpg'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Master Provider</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {user?.profile?.businessName || 'Specialist Services Inc.'} · Rate: <strong className="text-slate-800">${user?.profile?.hourlyRate || 65}/hr</strong>
              </p>
            </div>
          </div>

          {/* Availability Switch */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {isAvailable ? 'Receiving Requests' : 'Currently Offline'}
              </div>
              <div className="text-[11px] text-slate-500">
                {isAvailable ? 'Visible to nearby broadcast orders' : 'Paused incoming broadcasts'}
              </div>
            </div>
            <button
              onClick={handleToggleAvailability}
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
              title="Toggle request intake"
            >
              {isAvailable ? (
                <ToggleRight className="w-9 h-9 text-indigo-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Banners */}
        {errorBanner && (
          <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button onClick={() => setErrorBanner('')} className="text-rose-500 hover:text-rose-800">Dismiss</button>
          </div>
        )}
        {successBanner && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button onClick={() => setSuccessBanner('')} className="text-emerald-500 hover:text-emerald-800">Dismiss</button>
          </div>
        )}

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Incoming Requests</div>
            <div className="text-2xl font-bold text-amber-600 mt-2 tabular-nums">{pendingRequests.length}</div>
            <div className="text-[10px] text-slate-400 mt-1">Open pool for your trade</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Active Jobs</div>
            <div className="text-2xl font-bold text-indigo-600 mt-2 tabular-nums">{activeJobs.length}</div>
            <div className="text-[10px] text-slate-400 mt-1">Accepted or in-progress</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Jobs Completed</div>
            <div className="text-2xl font-bold text-emerald-600 mt-2 tabular-nums">
              {completedJobs.length + (user?.profile?.totalJobsCompleted || 0)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Lifetime total</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Total Earnings</div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">${totalEarnings}</div>
            <div className="text-[10px] text-slate-400 mt-1">Cleared payouts</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Customer Rating</div>
            <div className="text-2xl font-bold text-slate-900 mt-2 flex items-center gap-1.5 tabular-nums">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">From {reviewCount} verified visits</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <span>Incoming Requests</span>
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <span>Active Jobs</span>
              <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 text-[10px] flex items-center justify-center font-bold">
                {activeJobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'completed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              Completed Jobs ({completedJobs.length})
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'services'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              Manage My Services
            </button>
          </div>

          <button
            onClick={() => setShowAddService(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>List New Service</span>
          </button>
        </div>

        {/* TAB 1: Incoming Broadcast Requests Pool (Critical Requirement) */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-900 leading-relaxed">
              <strong>Atomic Broadcast Pool:</strong> These customer requests are waiting for a licensed specialist in your category. Once you accept, the job is atomically locked to your schedule and removed from all other providers.
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Pending Requests</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You're all caught up! New customer requests matching your trade will automatically stream into this pool in real time.
                </p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">#{req.bookingNumber}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">
                          Broadcast {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{req.service?.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900 tabular-nums">${req.amount}</span>
                      <span className="text-xs text-slate-400 font-medium">Payout</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="font-semibold text-slate-900 mb-1">Customer Problem Description:</div>
                        <p className="text-slate-600 leading-relaxed">{req.problemDescription}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Date: <strong className="text-slate-900">{req.scheduledDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Slot: <strong className="text-slate-900">{req.scheduledTimeSlot}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Location: {req.serviceAddress?.street}, {req.serviceAddress?.city}, {req.serviceAddress?.zipCode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer info & Action buttons */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Customer Details
                        </div>
                        <div className="text-xs font-bold text-slate-900">{req.customer?.name || 'Verified Customer'}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{req.serviceAddress?.contactPhone || '+1 (555) 789-0123'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                          disabled={actionLoading === `reject-${req.id}`}
                          onClick={() => handleReject(req.id)}
                          className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          disabled={actionLoading === `accept-${req.id}`}
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        >
                          {actionLoading === `accept-${req.id}` ? 'Locking...' : 'Accept Job'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Active Assigned Jobs */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Active Jobs Currently</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you accept an incoming request, it moves here so you can update progress, arrive on-site, and mark work completed.
                </p>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-xl"
                >
                  View Incoming Requests
                </button>
              </div>
            ) : (
              activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">#{job.bookingNumber}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                          {job.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{job.service?.title}</h3>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900 tabular-nums">${job.amount}</div>
                      <div className="text-[11px] text-slate-400">Payment on Completion</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="font-semibold text-slate-900 mb-1">Service Task Requirements:</div>
                        <p className="text-slate-600 leading-relaxed">{job.problemDescription}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Scheduled: <strong className="text-slate-900">{job.scheduledDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Slot: <strong className="text-slate-900">{job.scheduledTimeSlot}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Address: {job.serviceAddress?.street}, {job.serviceAddress?.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress actions */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Client Details
                        </div>
                        <div className="text-xs font-bold text-slate-900">{job.customer?.name}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.serviceAddress?.contactPhone}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        {job.status === 'Accepted' && (
                          <button
                            disabled={actionLoading === `start-${job.id}`}
                            onClick={() => handleStartWork(job.id)}
                            className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{actionLoading === `start-${job.id}` ? 'Updating...' : 'Start Work'}</span>
                          </button>
                        )}

                        {job.status === 'Work Started' && (
                          <button
                            disabled={actionLoading === `complete-${job.id}`}
                            onClick={() => handleCompleteWork(job.id)}
                            className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span>{actionLoading === `complete-${job.id}` ? 'Completing...' : 'Mark Job Completed'}</span>
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

        {/* TAB 3: Completed Jobs */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Completed Jobs Recorded Yet</h3>
                <p className="text-xs text-slate-500">
                  Completed assignments and payment disbursements will appear in this ledger.
                </p>
              </div>
            ) : (
              completedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">#{job.bookingNumber}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Completed
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{job.service?.title}</h3>
                    <p className="text-xs text-slate-500">Customer: {job.customer?.name} · {job.scheduledDate}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-slate-900 tabular-nums">${job.amount}</div>
                    <div className="text-xs text-emerald-600 font-semibold">{job.paymentStatus === 'Paid' ? 'Paid via Gateway' : 'Invoice Pending'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: Manage Services */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">My Service Offerings</h2>
                <p className="text-xs text-slate-500">Services listed under your verified professional profile.</p>
              </div>
              <button
                onClick={() => setShowAddService(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
              >
                + Add Service
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Emergency Circuit Breaker & Short Circuit Diagnostic</h4>
                  <p className="text-xs text-slate-500">Electrical Services · 1 hour duration</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">$89</span>
                  <span className="text-[11px] text-emerald-600 block">Active</span>
                </div>
              </div>
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">EV Home Charging Station Installation (Level 2)</h4>
                  <p className="text-xs text-slate-500">Electrical Services · 3-4 hours duration</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">$349</span>
                  <span className="text-[11px] text-emerald-600 block">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900">List New Service</h3>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="e.g. Smart Thermostat Installation & Setup"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newService.categoryId}
                  onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Standard Rate ($)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="85"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={newService.durationEstimate}
                    onChange={(e) => setNewService({ ...newService, durationEstimate: e.target.value })}
                    placeholder="1-2 hours"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Complete hardware mount, C-wire testing, Wi-Fi pairing..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
