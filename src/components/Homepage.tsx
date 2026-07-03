import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Hero from './Hero';
import PropertyCard from './PropertyCard';
import {
  TRENDING_DESTINATIONS, BLOG_POSTS, TESTIMONIALS, FAQS, PROPERTY_TYPES
} from '../data';
import {
  Sparkles, Compass, ShieldCheck, HeartHandshake, Star, ArrowRight, Check,
  ChevronDown, MessageSquare, Trees, Building, MapPin, Tablet, Laptop, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Homepage() {
  const { properties, setSelectedPropertyId, setCurrentPage, formatPrice } = useApp();

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'luxury' | 'beach' | 'mountain' | 'city' | 'countryside' | 'pet-friendly' | 'business'>('all');

  // Filter properties by active category
  const filteredListings = properties.filter((p) => {
    if (activeCategoryFilter === 'all') return p.featured;
    return p.category === activeCategoryFilter;
  });

  return (
    <div className="bg-[#FAFBFD] space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. BROWSE BY PROPERTY TYPE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Select Your Sanctuary Vibe</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Browse by Property Type</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {PROPERTY_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => {
                setCurrentPage('search');
              }}
              className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all text-center cursor-pointer group"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{type.name}</h3>
              <span className="text-[10px] text-gray-400 mt-1 block">{type.count} verified stays</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TRENDING DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Where Travel is Art</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Trending Global Destinations</h2>
          </div>
          <button
            onClick={() => setCurrentPage('search')}
            className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
          >
            Explore all Stays <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TRENDING_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                setCurrentPage('search');
              }}
              className="group relative rounded-2xl overflow-hidden aspect-3/4 bg-gray-900 cursor-pointer shadow-xs hover:shadow-lg transition-shadow"
            >
              <img
                src={dest.image}
                alt={dest.city}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{dest.country}</span>
                <h3 className="text-sm font-bold mt-0.5">{dest.city}</h3>
                <p className="text-[10px] text-gray-300 mt-1 line-clamp-1">{dest.tagline}</p>
                <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md mt-2 w-max">
                  {dest.propertiesCount}+ Verified stays
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FEATURED STAYS & LUXURY COLLECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">The Curation List</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Our Featured Luxury Collection</h2>
          <p className="text-xs text-gray-400 mt-2">Bespoke stays verified by ProStates regional directors</p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Featured' },
            { id: 'luxury', label: 'Luxury Stays' },
            { id: 'beach', label: 'Beachfronts' },
            { id: 'mountain', label: 'Mountain Retreats' },
            { id: 'city', label: 'City Apartments' },
            { id: 'countryside', label: 'Countryside' },
            { id: 'pet-friendly', label: 'Pet Friendly' },
            { id: 'business', label: 'Executive Stays' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>

      {/* 5. WHY CHOOSE LUXEHAVEN */}
      <div className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Uncompromising Standards</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Why travelers trust ProStates</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Unlike open listings databases, ProStates controls every step of your stays, ensuring that what you book is exactly what you get.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Box 1 */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-max">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">50-Point Curation Check</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every listed villa undergoes rigorous on-site verification of Wi-Fi speeds, beds, HVAC, and host backgrounds.
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-max">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Escrow Secure Payments</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your payments remain safe in ProStates escrow custody, only transferring to hosts 24 hours after successful check-in.
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-max">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">24/7 Global Concierge</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Enjoy absolute peace of mind with our dedicated client-support hotline operating in London, Tokyo, and New York.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. TESTIMONIALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Client Chronicles</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">What Our Guests Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((test) => (
            <div key={test.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-gray-600 italic leading-relaxed">"{test.comment}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <img src={test.avatar} alt={test.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{test.name}</h4>
                  <span className="text-[10px] text-gray-400">{test.location}</span>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{test.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. BECOME A HOST PROMOTION CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-3xl rounded-full" />

          <div className="relative z-10 space-y-4 max-w-xl text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Join the Elite</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none">
              Host Your High-End Property Globally
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Earn premium yields from verified business executives, digital nomads, and luxury vacation travelers looking for design-focused sanctuaries. We handle photography, verification, and payment gateways.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setCurrentPage('auth');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/15 transition-all cursor-pointer"
            >
              Become a Host
            </button>
            <button
              onClick={() => alert('Contacting curation helpline...')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Consult Curation Officer
            </button>
          </div>
        </div>
      </div>

      {/* 8. FAQS SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Assistance Desk</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = activeFAQ === index;
            return (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all shadow-xs">
                <button
                  onClick={() => setActiveFAQ(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-gray-900 cursor-pointer hover:bg-gray-50/50"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs text-gray-500 leading-relaxed border-t border-gray-50/60 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. TRAVEL BLOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">ProJournal</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">Travel Inspiration & Design Diaries</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between">
              <div>
                <img src={blog.image} alt={blog.title} className="w-full h-44 object-cover" referrerPolicy="no-referrer" />
                <div className="p-5 space-y-2">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{blog.date} • {blog.readTime}</span>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">{blog.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                </div>
              </div>
              <div className="p-5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                <span>By {blog.author}</span>
                <span className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5">Read Article <ArrowRight className="w-3 h-3" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. MOBILE APP PROMOTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50/50 rounded-3xl p-8 sm:p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3.5 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">ProStates Mobile App</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
              Manage Your Trips on the Go
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Download the ProStates iOS or Android application. Instant notifications, secure keyless entry codes, live co-host messaging, and in-app currency conversions are fully supported.
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 justify-center">
            <button
              onClick={() => alert('App Store checkout...')}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-2.5 font-bold text-xs shadow-sm cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[8px] text-gray-400 uppercase leading-none font-medium">Download on the</p>
                <p className="text-xs font-bold leading-none mt-1">App Store</p>
              </div>
            </button>
            <button
              onClick={() => alert('Google Play checkout...')}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-2.5 font-bold text-xs shadow-sm cursor-pointer"
            >
              <Tablet className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[8px] text-gray-400 uppercase leading-none font-medium">Get it on</p>
                <p className="text-xs font-bold leading-none mt-1">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
