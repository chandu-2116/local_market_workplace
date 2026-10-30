/**
 * Booking Request Modal for Customers
 */
import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function BookingModal({ service, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const { createBooking } = useMarketplace();

  const [formData, setFormData] = useState({
    problemDescription: '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'New York',
    state: user?.address?.state || 'NY',
    zipCode: user?.address?.zipCode || '10001',
    contactPhone: user?.phone || '+1 (555) 789-0123',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.problemDescription.trim()) {
      setError('Please provide a short description of the problem or requirements.');
      return;
    }
    if (!formData.street || !formData.zipCode || !formData.contactPhone) {
      setError('Please provide complete service address and contact phone.');
      return;
    }

    setLoading(true);
    try {
      const res = await createBooking({
        serviceId: service.id,
        problemDescription: formData.problemDescription,
        serviceAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          contactPhone: formData.contactPhone,
          notes: formData.notes,
        },
        scheduledDate: formData.scheduledDate,
        scheduledTimeSlot: formData.scheduledTimeSlot,
      });

      if (res.success) {
        setSuccessBooking(res.booking);
        if (onSuccess) onSuccess(res.booking);
      } else {
        setError(res.message || 'Failed to submit booking request.');
      }
    } catch (err) {
      setError(err.message || 'Network error submitting request.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Book Local Service</h3>
            <p className="text-xs text-slate-300 truncate max-w-sm">{service.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successBooking ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Request Broadcast to Providers!</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your request <span className="font-semibold text-slate-900 font-mono">#{successBooking.bookingNumber}</span> has been broadcast to qualified local providers in <span className="font-semibold">{service.category?.name || 'this category'}</span>. You will be notified as soon as a specialist accepts.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <div><span className="text-slate-500">Service:</span> <span className="font-medium text-slate-900">{service.title}</span></div>
              <div><span className="text-slate-500">Scheduled:</span> <span className="font-medium text-slate-900">{successBooking.scheduledDate} ({successBooking.scheduledTimeSlot})</span></div>
              <div><span className="text-slate-500">Estimated Total:</span> <span className="font-bold text-slate-900">${successBooking.amount}</span></div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              Done & View In Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Problem description */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Describe the problem or requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.problemDescription}
                onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                placeholder="e.g. Master bathroom sink pipe is leaking beneath the cabinet, water pools when faucet is turned on."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Schedule Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Time Slot <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.scheduledTimeSlot}
                  onChange={(e) => setFormData({ ...formData, scheduledTimeSlot: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>{ts}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address fields */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Service Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="240 East 38th St, Apt 14B"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Cost calculation breakdown */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900">Service Fee</div>
                <div className="text-slate-500 text-[11px]">Pay upon service completion</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-slate-900 tabular-nums">${service.price}</div>
                <div className="text-[10px] text-emerald-600 font-medium">Free Cancellation</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Broadcasting...' : 'Confirm Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
