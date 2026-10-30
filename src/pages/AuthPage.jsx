/**
 * UrbanFix Authentication Page
 * Supports login, registration (Customer & Provider roles), and 1-click test evaluation accounts.
 */
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Mail, Lock, User, Phone, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useMarketplace } from '../context/MarketplaceContext.jsx';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();
  const { categories } = useMarketplace();

  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'customer'); // 'customer' | 'provider'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('60');
  const [experienceYears, setExperienceYears] = useState('5');
  const [selectedCategories, setSelectedCategories] = useState(['cat-1']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const payload = {
          name,
          email,
          password,
          phone,
          role: selectedRole,
          ...(selectedRole === 'provider' && {
            businessName,
            bio,
            hourlyRate: Number(hourlyRate),
            experienceYears: Number(experienceYears),
            categoryIds: selectedCategories,
          }),
        };
        const res = await register(payload);
        if (res.success) {
          redirectUser(res.user.role);
        } else {
          setError(res.message || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          redirectUser(res.user.role);
        } else {
          setError(res.message || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'provider') navigate('/provider/dashboard');
    else navigate('/customer/dashboard');
  };

  const handleDemo = async (roleType) => {
    setError('');
    setLoading(true);
    try {
      const res = await demoLogin(roleType);
      if (res.success) {
        redirectUser(res.user.role);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to log in with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <span>UrbanFix</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Join as a customer to book services or as a professional provider.'
              : 'Sign in to access your bookings, jobs, or management tools.'}
          </p>
        </div>

        {/* 1-Click Evaluation Accounts Box */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 space-y-2.5">
          <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Instant Evaluation / Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('customer')}
              className="px-2 py-2 text-center bg-white hover:bg-indigo-100/60 border border-indigo-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-xs"
            >
              <div>Customer</div>
              <div className="text-[10px] text-slate-500 font-normal">Priya P.</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('provider')}
              className="px-2 py-2 text-center bg-white hover:bg-indigo-100/60 border border-indigo-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-xs"
            >
              <div>Provider</div>
              <div className="text-[10px] text-slate-500 font-normal">Liam D.</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="px-2 py-2 text-center bg-white hover:bg-indigo-100/60 border border-indigo-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors shadow-xs"
            >
              <div>Admin</div>
              <div className="text-[10px] text-slate-500 font-normal">Marcus V.</div>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Mode Switch (Sign In vs Register) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                !isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* If Registering, choose Customer vs Provider */}
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('customer')}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      selectedRole === 'customer'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('provider')}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      selectedRole === 'provider'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Service Provider
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Provider specific registration fields */}
            {isRegister && selectedRole === 'provider' && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Business / Trade Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Precision HVAC & Electrical"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Hourly Rate ($)</label>
                    <input
                      type="number"
                      required
                      min="15"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Years Experience</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Primary Trade Category</label>
                  <select
                    value={selectedCategories[0]}
                    onChange={(e) => setSelectedCategories([e.target.value])}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Complete Registration' : 'Sign In to UrbanFix'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
