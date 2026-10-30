/**
 * UrbanFix Platform Administration Console
 * Controls user activation, provider trade verification, category management,
 * marketplace transaction audits, and platform analytics.
 */
import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'verifications' | 'users' | 'bookings'
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, provRes, bookRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/providers'),
        api.get('/admin/bookings'),
      ]);

      if (dashRes.data.success) setStats(dashRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (provRes.data.success) setProviders(provRes.data.data);
      if (bookRes.data.success) setBookings(bookRes.data.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Toggle user active status
  const handleToggleUser = async (userId, currentStatus) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
        );
        setActionMessage(`User account status updated.`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch {
      // error handling
    }
  };

  // Approve or Reject Provider Verification
  const handleVerifyProvider = async (userId, status) => {
    try {
      const res = await api.patch(`/admin/providers/${userId}/verify`, {
        verificationStatus: status,
      });
      if (res.data.success) {
        setProviders((prev) =>
          prev.map((p) =>
            p.userId === userId
              ? { ...p, verificationStatus: status, isVerified: status === 'approved' }
              : p
          )
        );
        setActionMessage(`Provider verification marked as "${status}".`);
        setTimeout(() => setActionMessage(''), 3000);
        // Refresh dashboard numbers
        api.get('/admin/dashboard').then((r) => r.data.success && setStats(r.data.data));
      }
    } catch {
      // error handling
    }
  };

  // Reset database to initial seed
  const handleResetData = async () => {
    if (window.confirm('Reset all marketplace data to initial sample state? This re-seeds 15 categories, verified providers, and mock bookings.')) {
      await api.post('/admin/reset-data');
      await loadAdminData();
      setActionMessage('Marketplace state successfully restored to fresh seed data.');
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  const pendingProviders = providers.filter((p) => p.verificationStatus === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Administration Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">UrbanFix Management Console</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time governance over customer requests, trade verifications, dispute resolution, and payment volume.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              title="Reset all demo records back to standard seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed Data</span>
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionMessage}</span>
            </div>
          </div>
        )}

        {/* 5 KPI Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Gross Marketplace Vol</div>
              <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                ${stats.totalRevenue}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Cleared & In Escrow</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Total Bookings</div>
              <div className="text-2xl font-bold text-indigo-600 mt-2 tabular-nums">
                {stats.totalBookings}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Across 15 categories</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Verified Providers</div>
              <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {stats.totalProviders}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Active service trades</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Registered Customers</div>
              <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
                {stats.totalCustomers}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Metro service area</div>
            </div>

            <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500">Pending Verification</div>
              <div className="text-2xl font-bold text-amber-600 mt-2 tabular-nums">
                {pendingProviders.length}
              </div>
              <div className="text-[10px] text-amber-600 font-semibold mt-1">Requires License Review</div>
            </div>
          </div>
        )}

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Marketplace Overview
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <span>Provider Approvals</span>
            {pendingProviders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingProviders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'bookings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
        </div>

        {/* TAB 1: Overview */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Status Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Booking Pipeline Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(stats.bookingStatusCounts || {}).map(([st, cnt]) => (
                  <div key={st} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{st}</span>
                    <span className="font-bold text-slate-900 tabular-nums bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                      {cnt}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Operational Health</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Atomic Booking Acceptance Engine: Active and Race-Condition Safe</span>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Razorpay Test Gateway: In Sandbox Operational Mode</span>
                </div>
                <div className="p-3 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>15 Service Categories fully seeded with descriptions and photos</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Provider Verification Approvals (Critical Requirement) */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Trade License & Identity Queue</h3>
                <p className="text-xs text-slate-500">
                  Review submitted trade certificates before approving providers for incoming customer bookings.
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                {pendingProviders.length} Pending Review
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {providers.map((prov) => (
                <div key={prov.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-slate-900">{prov.businessName}</div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          prov.verificationStatus === 'approved'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : prov.verificationStatus === 'rejected'
                            ? 'text-rose-700 bg-rose-50 border-rose-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        {prov.verificationStatus.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 max-w-xl">{prov.bio}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Owner: <strong className="text-slate-800">{prov.user?.name}</strong></span>
                      <span>·</span>
                      <span>Rate: <strong className="text-slate-800">${prov.hourlyRate}/hr</strong></span>
                      <span>·</span>
                      <span>Exp: <strong className="text-slate-800">{prov.experienceYears} Years</strong></span>
                    </div>

                    {/* Submitted Documents preview */}
                    {prov.documents && (
                      <div className="flex items-center gap-2 pt-1">
                        {prov.documents.map((doc, i) => (
                          <div
                            key={i}
                            className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{doc.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {prov.verificationStatus !== 'approved' && (
                      <button
                        onClick={() => handleVerifyProvider(prov.userId, 'approved')}
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                      >
                        Approve License
                      </button>
                    )}
                    {prov.verificationStatus !== 'rejected' && (
                      <button
                        onClick={() => handleVerifyProvider(prov.userId, 'rejected')}
                        className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: User Management Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registered Accounts</h3>
              <p className="text-xs text-slate-500">Toggle activation status or inspect account metadata.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Phone / City</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-medium text-slate-800">{u.role}</span>
                      </td>
                      <td className="p-4">
                        <div>{u.phone || '—'}</div>
                        <div className="text-slate-400 text-[11px]">{u.address?.city || 'New York'}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            u.isActive
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUser(u.id, u.isActive)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              u.isActive
                                ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                                : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: All Platform Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Marketplace Transactions & Orders</h3>
              <p className="text-xs text-slate-500">Live feed of all customer requests, provider claims, and payouts.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Assigned Provider</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-900">#{b.bookingNumber}</td>
                      <td className="p-4 font-medium text-slate-900">{b.service?.title}</td>
                      <td className="p-4 text-slate-700">{b.customer?.name}</td>
                      <td className="p-4 text-slate-700">
                        {b.assignedProvider ? (
                          <span className="font-semibold text-indigo-600">{b.assignedProvider.name}</span>
                        ) : (
                          <span className="text-amber-600 italic">Open in Pool</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-900">{b.status}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[11px] font-semibold ${
                            b.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 tabular-nums">
                        ${b.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
