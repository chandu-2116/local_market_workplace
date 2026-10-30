/**
 * UrbanFix Services Marketplace Catalog Page
 * Supports interactive filtering by category, price, rating, and keyword.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import BookingModal from '../components/booking/BookingModal.jsx';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, services, fetchServices, loading } = useMarketplace();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [activeBookingService, setActiveBookingService] = useState(null);

  // Sync URL search params
  useEffect(() => {
    const filters = {};
    if (search) filters.search = search;
    if (categoryId) {
      // Find category ID from slug if needed
      const cat = categories.find((c) => c.slug === categoryId || c.id === categoryId);
      if (cat) filters.categoryId = cat.id;
    }
    if (maxPrice) filters.maxPrice = maxPrice;
    if (minRating) filters.minRating = minRating;

    fetchServices(filters);
  }, [search, categoryId, maxPrice, minRating, categories, fetchServices]);

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setMaxPrice('');
    setMinRating('');
    setSearchParams({});
    fetchServices({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Marketplace Directory</div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Discover Local Services</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse through all verified local trade services with transparent upfront pricing.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Price Filter */}
            <div>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="80">Under $80</option>
                <option value="120">Under $120</option>
                <option value="200">Under $200</option>
                <option value="350">Under $350</option>
              </select>
            </div>

            {/* Min Rating Filter */}
            <div className="flex items-center gap-2">
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="flex-1 text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Any Rating</option>
                <option value="4.8">4.8 Stars and above</option>
                <option value="4.9">4.9 Stars and above</option>
              </select>

              {(search || categoryId || maxPrice || minRating) && (
                <button
                  onClick={handleResetFilters}
                  className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
                <div className="h-40 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any services matching your current filters. Try resetting the filters or searching for another term.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-900 shadow-sm">
                      {service.category?.name || 'Local Service'}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-slate-800 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{service.rating}</span>
                        <span className="text-slate-400 font-normal">({service.reviewCount})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{service.durationEstimate}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {service.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {service.features && (
                      <div className="space-y-1 pt-1">
                        {service.features.slice(0, 2).map((feat, i) => (
                          <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard Rate</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">${service.price}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/auth');
                      } else {
                        setActiveBookingService(service);
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeBookingService && (
        <BookingModal
          service={activeBookingService}
          isOpen={!!activeBookingService}
          onClose={() => setActiveBookingService(null)}
          onSuccess={() => {
            navigate('/customer/dashboard');
          }}
        />
      )}
    </div>
  );
}
