/**
 * Customer Review Submission Modal
 */
import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function ReviewModal({ booking, isOpen, onClose, onSuccess }) {
  const { submitReview } = useMarketplace();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment describing your experience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await submitReview({
        bookingId: booking.id,
        rating,
        comment,
      });

      if (res.success) {
        setSuccess(true);
        if (onSuccess) onSuccess(res.review);
      } else {
        setError(res.message || 'Failed to submit review.');
      }
    } catch (err) {
      setError(err.message || 'Network error submitting review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="text-sm font-semibold">Rate & Review Service</div>
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
            <h4 className="text-lg font-bold text-slate-900">Review Submitted!</h4>
            <p className="text-xs text-slate-600">
              Thank you for supporting our local service professionals. Your review has been added to their verified profile.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div>
              <div className="text-xs text-slate-500 mb-1">Service Provider</div>
              <div className="text-sm font-semibold text-slate-900">
                {booking.assignedProvider?.name || 'Assigned Specialist'}
              </div>
              <div className="text-xs text-slate-600">{booking.service?.title}</div>
            </div>

            {/* Star selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-700 ml-2">
                  {rating === 5 ? 'Excellent (5.0)' : `${rating}.0 Stars`}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Detailed Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the quality of work, punctuality, and communication?"
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
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
                {loading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
