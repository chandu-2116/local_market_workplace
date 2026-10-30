/**
 * UrbanFix Navigation Bar
 * Adheres strictly to the 3-zone Top Bar Contract and Zero-Pill typography.
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  Bell,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, role, logout, demoLogin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (roleType) => {
    setShowDemoMenu(false);
    await demoLogin(roleType);
    if (roleType === 'customer') navigate('/customer/dashboard');
    else if (roleType === 'provider') navigate('/provider/dashboard');
    else if (roleType === 'admin') navigate('/admin/dashboard');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'provider') return '/provider/dashboard';
    return '/customer/dashboard';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand title, one line */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <span>UrbanFix</span>
          </Link>

          {/* Zone 2: 4–5 single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link
              to="/services"
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 ${
                location.pathname === '/services' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              All Services
            </Link>
            <Link
              to="/services?category=home-cleaning"
              className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
            >
              Cleaning
            </Link>
            <Link
              to="/services?category=electrical-services"
              className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
            >
              Electrical
            </Link>
            <Link
              to="/services?category=plumbing-services"
              className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
            >
              Plumbing
            </Link>
            <Link
              to="/#how-it-works"
              className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </Link>
          </nav>

          {/* Zone 3: 1 primary action or user account cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowDemoMenu(!showDemoMenu);
                  setShowUserMenu(false);
                  setShowNotifMenu(false);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Quickly test app as Customer, Provider, or Admin"
              >
                <span className="capitalize">{isAuthenticated ? `Role: ${role}` : 'Demo Accounts'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Demo Switch
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('customer')}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-900">Priya Patel (Customer)</div>
                      <div className="text-slate-500 text-[11px]">Bookings & checkout</div>
                    </div>
                    {role === 'customer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('provider')}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-900">Liam Davis (Provider)</div>
                      <div className="text-slate-500 text-[11px]">Accept jobs & earnings</div>
                    </div>
                    {role === 'provider' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-900">Marcus Vance (Admin)</div>
                      <div className="text-slate-500 text-[11px]">Approvals & metrics</div>
                    </div>
                    {role === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowUserMenu(false);
                    setShowDemoMenu(false);
                  }}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-indigo-600 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-semibold text-slate-900">Notifications ({notifications.length})</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">No notifications yet.</div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) navigate(n.link);
                              setShowNotifMenu(false);
                            }}
                            className={`py-2.5 px-2 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors ${
                              !n.isRead ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated user menu vs Login CTA */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifMenu(false);
                    setShowDemoMenu(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden lg:inline text-xs font-medium text-slate-800">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                      <div className="mt-1 text-[11px] font-medium text-indigo-600 capitalize">
                        {role === 'provider' ? 'Service Provider' : role === 'admin' ? 'Platform Administrator' : 'Customer'}
                      </div>
                    </div>
                    <div className="pt-1">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Go to Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              All Services
            </Link>
            <Link
              to="/services?category=home-cleaning"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Cleaning
            </Link>
            <Link
              to="/services?category=electrical-services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Electrical
            </Link>
            <Link
              to="/services?category=plumbing-services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700"
            >
              Plumbing
            </Link>
            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-indigo-600"
              >
                My Dashboard ({role})
              </Link>
            )}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Demo Roles:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleDemoSwitch('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 bg-slate-100 rounded font-medium text-slate-700"
                >
                  Customer
                </button>
                <button
                  onClick={() => {
                    handleDemoSwitch('provider');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 bg-slate-100 rounded font-medium text-slate-700"
                >
                  Provider
                </button>
                <button
                  onClick={() => {
                    handleDemoSwitch('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-1 bg-slate-100 rounded font-medium text-slate-700"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
