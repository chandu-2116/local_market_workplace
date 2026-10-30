/**
 * Razorpay Payment Gateway (Test Mode) Integration Modal
 */
import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, Smartphone, Banknote } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function PaymentModal({ booking, isOpen, onClose, onSuccess }) {
  const { processPayment } = useMarketplace();
  const [method, setMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const handlePay = async () => {
    setLoading(true);
    setError('');

    try {
      const mockPaymentId = `pay_rzp_test_${Date.now()}`;
      const res = await processPayment({
        bookingId: booking.id,
        amount: booking.amount,
        paymentMethod: method,
        razorpayPaymentId: mockPaymentId,
      });

      if (res.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Payment processing failed');
      }
    } catch (err) {
      setError(err.message || 'Network error completing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Razorpay Gateway Test Mode</div>
              <div className="text-sm font-semibold">Secure Checkout</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
            <p className="text-xs text-slate-600">
              Payment of <span className="font-bold text-slate-900">${booking.amount}</span> has been processed for booking <span className="font-mono font-medium">#{booking.bookingNumber}</span>.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1">
              <div><span className="text-slate-400">Payment ID:</span> pay_rzp_test_{Date.now()}</div>
              <div><span className="text-slate-400">Status:</span> Completed</div>
              <div><span className="text-slate-400">Provider:</span> {booking.assignedProvider?.name || 'Assigned Specialist'}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* Summary card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 mb-1">Booking #{booking.bookingNumber}</div>
              <div className="text-sm font-semibold text-slate-900">{booking.service?.title || 'Home Service'}</div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Amount Due:</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">${booking.amount}</span>
              </div>
            </div>

            {/* Payment Method selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('Razorpay')}
                  className={`p-3 text-center rounded-xl border text-xs font-medium transition-all ${
                    method === 'Razorpay'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                  Razorpay Card
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`p-3 text-center rounded-xl border text-xs font-medium transition-all ${
                    method === 'UPI'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  Instant UPI
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('Cash')}
                  className={`p-3 text-center rounded-xl border text-xs font-medium transition-all ${
                    method === 'Cash'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  Cash on Hand
                </button>
              </div>
            </div>

            {/* Test Mode Mock credentials box */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Razorpay Sandbox Credentials Active</span>
              </div>
              <div className="text-[11px] text-amber-700">
                Key ID: <code className="bg-amber-100 px-1 rounded font-mono">rzp_test_urbanfix_gateway</code>
              </div>
              <div className="text-[11px] text-amber-700">
                Mock Card: <code className="bg-amber-100 px-1 rounded font-mono">4111 2222 3333 4444</code> (CVV: 123)
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
                type="button"
                onClick={handlePay}
                disabled={loading}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Authorizing...' : `Pay $${booking.amount}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
