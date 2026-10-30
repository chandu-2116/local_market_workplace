/**
 * UrbanFix Home Page
 * Adheres to universal frontend design standards: clean typography, zero slop,
 * and high-fidelity visual assets.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  Hammer,
  Paintbrush,
  Tv,
  Scissors,
  GraduationCap,
  Camera,
  Car,
  Laptop,
  Home as HomeIcon,
  Trees,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import BookingModal from '../components/booking/BookingModal.jsx';

export default function HomePage() {
  const { categories, services } = useMarketplace();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeBookingService, setActiveBookingService] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    navigate(`/services?${params.toString()}`);
  };

  // Map category slug to lucide icon
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'electrical-services': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'plumbing-services': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'ac-repair-maintenance': return <Wind className="w-5 h-5 text-cyan-500" />;
      case 'home-cleaning': return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'carpenter-services': return <Hammer className="w-5 h-5 text-orange-500" />;
      case 'painting-services': return <Paintbrush className="w-5 h-5 text-indigo-500" />;
      case 'appliance-repair': return <Tv className="w-5 h-5 text-purple-500" />;
      case 'pest-control': return <ShieldCheck className="w-5 h-5 text-rose-500" />;
      case 'beauty-personal-care': return <Scissors className="w-5 h-5 text-pink-500" />;
      case 'tutors-education': return <GraduationCap className="w-5 h-5 text-yellow-600" />;
      case 'photography': return <Camera className="w-5 h-5 text-teal-500" />;
      case 'vehicle-repair': return <Car className="w-5 h-5 text-red-500" />;
      case 'computer-laptop-repair': return <Laptop className="w-5 h-5 text-blue-600" />;
      case 'interior-design': return <HomeIcon className="w-5 h-5 text-violet-500" />;
      case 'gardening-landscaping': return <Trees className="w-5 h-5 text-green-600" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Certified Local Professionals · Guaranteed Workmanship</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
              Reliable Local Services at Your Fingertips.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Connect with verified electricians, master plumbers, deep cleaners, and technicians. Upfront pricing, broadcast requests, and atomic provider assignment.
            </p>

            {/* Powerful Service Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-2xl border border-slate-300 shadow-md flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-3 gap-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need? (e.g. leak repair, circuit breaker)"
                  className="w-full text-xs sm:text-sm py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="sm:border-l border-slate-200 flex items-center px-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm py-2 text-slate-600 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All 15 Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Find Services
              </button>
            </form>

            {/* Quick stats strip */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>15 Vetted Categories</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Surprise Charges</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4.9 / 5 Average Rating</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 aspect-[4/3] lg:aspect-auto lg:h-[480px]">
              <img
                src="/src/assets/images/urbanfix_hero_banner_1793379908387.jpg"
                alt="UrbanFix Service Specialist"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/src/assets/images/provider_profile_avatar_1793379954226.jpg"
                    alt="Liam Davis"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>Liam Davis</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">Master Electrician · 140+ Jobs</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.95</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Available Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Core Service Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore Service Categories</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select from all 15 specialized local trade services available across your neighborhood.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/services?category=${cat.slug}`}
              className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors">
                  {getCategoryIcon(cat.slug)}
                </div>
                <h3 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                {cat.servicesCount || 10}+ specialists
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Guaranteed Quality</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Service Packages</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Transparent upfront quotes with insured, certified local professionals.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>See Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Image banner */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-900 shadow-sm">
                      {service.category?.name || 'Home Service'}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
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

                    {/* Features list */}
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

                {/* Footer price & CTA */}
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
        </div>
      </section>

      {/* How UrbanFix Works Section */}
      <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Seamless Experience</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How UrbanFix Works</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            From discovering your service to final payment and review in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-extrabold text-indigo-600/30 mb-3 font-mono">01</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Find & Select Service</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse 15 curated categories, compare ratings, price brackets, and reviews from real customers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-extrabold text-indigo-600/30 mb-3 font-mono">02</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Submit Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Describe your specific repair or installation, pick preferred date and time, and submit your address.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-extrabold text-indigo-600/30 mb-3 font-mono">03</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Provider Accepts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eligible local specialists review the request. The first specialist accepts with atomic verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="text-3xl font-extrabold text-indigo-600/30 mb-3 font-mono">04</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Work & Secure Pay</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track progress as work starts. When marked complete, finalize payment via Razorpay and leave feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Top Rated Service Providers Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Vetted Professionals</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Meet Our Top Rated Specialists</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Background-checked, certified professionals with hundreds of 5-star ratings.
              </p>
            </div>
            <Link
              to="/auth?mode=register&role=provider"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              <span>Join as a Provider</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/provider_profile_avatar_1793379954226.jpg"
                  alt="Liam Davis"
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Liam Davis</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xs text-slate-400">Master Electrician · 9 yrs exp</div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.94 (138 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Specializes in circuit breaker repairs, electric vehicle chargers, and smart automation systems.
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>142 Jobs Completed</span>
                <span className="font-semibold text-white tabular-nums">$65 / hr</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Maria Rodriguez"
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Maria Rodriguez</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400">EcoClean Pro Specialist · 7 yrs exp</div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.96 (220 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Expert deep sanitization, hypoallergenic green cleaning, and move-in apartment turnover.
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>235 Jobs Completed</span>
                <span className="font-semibold text-white tabular-nums">$50 / hr</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
                  alt="Robert Miller"
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Robert Miller</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xs text-slate-400">Journeyman Plumber · 12 yrs exp</div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.88 (164 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Emergency burst pipe resolution, water heater diagnostics, drain scoping, and fixture installs.
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>182 Jobs Completed</span>
                <span className="font-semibold text-white tabular-nums">$70 / hr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section id="testimonials" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Real Experiences</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trusted by Thousands of Homeowners</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "Liam resolved our dead kitchen breaker within 30 minutes of accepting the request. He showed me the burned connection wire and replaced the breaker safely. The tracking in the app was crystal clear!"
            </p>
            <div className="pt-2 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Priya Patel"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Priya Patel</div>
                <div className="text-[11px] text-slate-500">Manhattan, NY · Circuit Breaker Repair</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "EcoClean did a deep clean before my in-laws arrived. No toxic chemical smell at all, baseboards wiped clean, and payment through Razorpay test mode was seamless. UrbanFix is my go-to service app now."
            </p>
            <div className="pt-2 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Alexander Scott"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Alexander Scott</div>
                <div className="text-[11px] text-slate-500">Brooklyn, NY · Full Home Sanitization</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
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
