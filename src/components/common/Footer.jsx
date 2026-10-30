/**
 * UrbanFix Footer
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, CreditCard, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Trust Guarantee Strip */}
      <div className="border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Verified Specialists</div>
              <div className="text-xs text-slate-400">Background checked and licensed</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Guaranteed Punctuality</div>
              <div className="text-xs text-slate-400">On-time arrival or credit reward</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Protected Checkout</div>
              <div className="text-xs text-slate-400">Pay only upon job satisfaction</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">UrbanFix Promise</div>
              <div className="text-xs text-slate-400">30-day workmanship warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span>UrbanFix</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
            UrbanFix connects home owners and businesses with thoroughly vetted, top-rated local professionals. Transparent pricing, instant booking, and guaranteed reliability.
          </p>
          <div className="text-xs text-slate-500">
            Headquarters: 100 Broadway, New York, NY 10005 · Support: +1 (800) 555-FIX
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Popular Trades</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/services?category=electrical-services" className="hover:text-white transition-colors">Electrical Services</Link></li>
            <li><Link to="/services?category=plumbing-services" className="hover:text-white transition-colors">Plumbing Repairs</Link></li>
            <li><Link to="/services?category=home-cleaning" className="hover:text-white transition-colors">Home Deep Cleaning</Link></li>
            <li><Link to="/services?category=ac-repair-maintenance" className="hover:text-white transition-colors">AC Tune-ups & Repair</Link></li>
            <li><Link to="/services?category=appliance-repair" className="hover:text-white transition-colors">Appliance Diagnostic</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Marketplace</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/services" className="hover:text-white transition-colors">Explore All Services</Link></li>
            <li><Link to="/auth?mode=register&role=provider" className="hover:text-white transition-colors">Join as a Service Provider</Link></li>
            <li><Link to="/#how-it-works" className="hover:text-white transition-colors">How UrbanFix Works</Link></li>
            <li><Link to="/#testimonials" className="hover:text-white transition-colors">Customer Reviews</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Console</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Account & Safety</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/customer/dashboard" className="hover:text-white transition-colors">Customer Dashboard</Link></li>
            <li><Link to="/provider/dashboard" className="hover:text-white transition-colors">Provider Dashboard</Link></li>
            <li><span className="text-slate-500">Terms of Service</span></li>
            <li><span className="text-slate-500">Privacy Policy</span></li>
            <li><span className="text-slate-500">Dispute Resolution</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© {new Date().getFullYear()} UrbanFix Technologies Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <span>Security Audited</span>
            <span>·</span>
            <span>Razorpay Test Gateway</span>
            <span>·</span>
            <span>MongoDB Mongoose Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
