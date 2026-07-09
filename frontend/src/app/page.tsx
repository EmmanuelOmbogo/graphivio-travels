'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Tour, Review } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TourCard } from '@/components/TourCard';
import { 
  Compass, ShieldCheck, Map, Users, Search, Star, Volume2, VolumeX, ChevronDown,
  HelpCircle, CheckCircle2, Leaf, ArrowRight, Sparkles, MessageSquare, AlertCircle, RefreshCw
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDifficulty, setSearchDifficulty] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Trip Customizer State
  const [customizerStep, setCustomizerStep] = useState(1);
  const [selectedDest, setSelectedDest] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [durationDays, setDurationDays] = useState(4);
  const [travelersCount, setTravelersCount] = useState(2);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [customizerSuccess, setCustomizerSuccess] = useState(false);

  const resetCustomizer = () => {
    setCustomizerStep(1);
    setSelectedDest('');
    setSelectedStyle('');
    setDurationDays(4);
    setTravelersCount(2);
    setContactName('');
    setContactEmail('');
    setCustomizerSuccess(false);
  };

  const handleCustomizerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send a request to a backend endpoint.
    // We will simulate success and open a prefilled mailto link for convenience.
    const subject = encodeURIComponent(`Custom Trip Request: ${selectedDest || 'Unspecified Destination'}`);
    const body = encodeURIComponent(
      `Hello Graphivio Team,\n\nI would like to request a custom travel itinerary with the following details:\n` +
      `- Destination: ${selectedDest || 'Not decided yet'}\n` +
      `- Style: ${selectedStyle || 'Not decided yet'}\n` +
      `- Duration: ${durationDays} Days\n` +
      `- Number of Travelers: ${travelersCount} guests\n` +
      `- Contact Name: ${contactName}\n\n` +
      `Please get in touch with me as soon as possible.\n\nBest regards,\n${contactName}`
    );
    
    // Set success and open the mail client
    setCustomizerSuccess(true);
    window.open(`mailto:reservations@graphivio.com?subject=${subject}&body=${body}`, '_blank');
  };

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const { data: tours } = useQuery<Tour[]>({
    queryKey: ['featuredTours'],
    queryFn: async () => {
      const res = await api.get('/tours');
      return res.data;
    },
  });

  // Fetch latest public reviews
  const { data: latestReviews } = useQuery<(Review & { tour?: { id: string; title: string; location: string } })[]>({
    queryKey: ['latestReviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/latest?limit=6');
      return res.data;
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchDifficulty) params.set('difficulty', searchDifficulty);
    router.push(`/tours?${params.toString()}`);
  };

  const mockTours: Tour[] = [
    {
      id: '1',
      title: 'Maasai Mara National Reserve Safari',
      description: "Experience the crown jewel of Kenya's wildlife viewing. Maasai Mara is world-famous for its exceptional population of lions, leopards, cheetahs, and the Great Migration.",
      price: 180000, durationDays: 4, location: 'Maasai Mara, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
      images: [], maxGroupSize: 8, difficulty: 'EASY', ratingsAverage: 4.7, ratingsQuantity: 3505, active: true, itinerary: [], createdAt: '',
    },
    {
      id: '2',
      title: 'Diani Beach Tropical Getaway',
      description: "Unwind at Kenya's premier beach paradise. Diani Beach boasts flawless powder-white sand, sparkling turquoise waters, and Swahili coastal forests.",
      price: 45000, durationDays: 4, location: 'Diani, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=800&q=80',
      images: [], maxGroupSize: 10, difficulty: 'EASY', ratingsAverage: 4.7, ratingsQuantity: 2086, active: true, itinerary: [], createdAt: '',
    },
    {
      id: '3',
      title: 'Vallée de Mai UNESCO Reserve Expedition',
      description: 'Explore the prehistoric rainforest of Vallée de Mai on Praslin Island, Seychelles. Home of the giant, uniquely shaped Coco de Mer palm trees.',
      price: 60000, durationDays: 2, location: 'Praslin, Seychelles',
      imageCover: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
      images: [], maxGroupSize: 6, difficulty: 'MEDIUM', ratingsAverage: 4.3, ratingsQuantity: 1919, active: true, itinerary: [], createdAt: '',
    },
  ];

  const displayTours = tours && tours.length > 0 ? tours.slice(0, 3) : mockTours;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ===== HERO — Image Background with Glassmorphic Search ===== */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden pb-16">
        {/* Background Image */}
        <img
          src="/hero-bg.png"
          alt="Turquoise River"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark cinematic overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,10,20,0.6) 0%, rgba(5,10,20,0.4) 60%, rgba(5,10,20,0.8) 100%)',
          }}
        />

        {/* Content (Vertically and Horizontally Centered) */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 pt-32 text-center max-w-5xl mx-auto space-y-6">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest border backdrop-blur-md shadow-sm"
            style={{ color: '#F97316', background: 'rgba(249,115,22,0.15)', borderColor: 'rgba(249,115,22,0.3)' }}
          >
            <Compass className="h-3.5 w-3.5 animate-spin-slow" />
            Explore the Unexplored
          </span>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-2xl text-white"
          >
            Crafting Unforgettable{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #F97316, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Journeys
            </span>{' '}
            Around the Globe
          </h1>

          <p
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed drop-shadow-md text-white/90"
          >
            Discover customized plans, curated local guides, and top-tier accommodations.
            Start searching your next dream holiday today.
          </p>
        </div>

        {/* Floating Glassmorphic Search Bar (Bottom Docked) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 mt-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row backdrop-blur-xl bg-white/70 border border-white/30 rounded-3xl shadow-2xl p-3 gap-3 transition hover:bg-white/80 duration-300"
          >
            {/* Search Input */}
            <div className="relative flex-1 flex items-center border-b md:border-b-0 md:border-r border-black/10 px-4 py-2">
              <Search className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
              <div className="flex flex-col flex-1 w-full">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Search</label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Insert keyword..."
                  className="w-full text-sm font-semibold focus:outline-none text-gray-900 placeholder-gray-400 py-0.5 bg-transparent"
                />
              </div>
            </div>

            {/* Destinations Dropdown */}
            <div className="relative flex-1 flex items-center px-4 py-2">
              <Map className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
              <div className="flex flex-col flex-1 w-full">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Destinations</label>
                <select
                  value={searchDifficulty}
                  onChange={(e) => setSearchDifficulty(e.target.value)}
                  className="w-full text-sm font-semibold focus:outline-none text-gray-900 py-0.5 appearance-none cursor-pointer bg-transparent"
                >
                  <option value="">Any Destination</option>
                  <option value="EASY">Easy Routes</option>
                  <option value="MEDIUM">Medium Treks</option>
                  <option value="DIFFICULT">Difficult Climbs</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-10 py-4 rounded-2xl font-black text-white transition hover:scale-[1.03] active:scale-[0.98] duration-200 shadow-xl text-sm tracking-widest"
              style={{ background: '#F97316' }} /* Bonfire Orange */
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* ===== FEATURED TOURS ===== */}
      <section className="py-24 bg-white" style={{ borderBottom: '1px solid rgba(0,95,115,0.08)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="inline-block text-xs font-black uppercase tracking-widest mb-1 text-orange-500">
              Our Picks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
              Featured Adventures
            </h2>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-4 rounded-full" />
            <p className="max-w-lg mx-auto text-sm text-gray-500 pt-2">
              Hand-picked journeys vetted for the highest satisfaction, scenic beauty, and authentic cultural immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          <div className="text-center mt-14">
            <a
              href="/tours"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-sm transition hover:scale-105 duration-200 shadow-md hover:shadow-cyan-900/10"
              style={{ background: '#005F73', color: '#FFFFFF' }}
            >
              View All Tours →
            </a>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION — Premium Dark Theme ===== */}
      <section className="py-28 text-white" style={{ background: '#081C24' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-3">
            <span className="inline-block text-xs font-black uppercase tracking-widest" style={{ color: '#F97316' }}>
              Why Graphivio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">We Raise the Bar</h2>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Secure Bookings', body: '100% money-back guarantee, flexible cancellation, and verified secure checkouts on every booking.' },
              { icon: Map, title: 'Curated Itineraries', body: 'Each destination is scouted by local experts to deliver original, deeply immersive, non-generic experiences.' },
              { icon: Users, title: 'Local Guides', body: 'Support local communities while discovering culture, history, and the hidden secrets of each region.' },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.04] border border-white/5 bg-white/[0.02] shadow-xl"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6 shadow-lg transition-transform duration-300 hover:rotate-6 border border-cyan-500/20"
                  style={{ background: 'rgba(6,182,212,0.1)' }}
                >
                  <Icon className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE TRIP CUSTOMIZER WIZARD ===== */}
      <section className="py-24 bg-[#FFF9F4]" style={{ borderBottom: '1px solid rgba(0,95,115,0.08)' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-orange-500">
              Interactive Planner
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
              Build Your Dream Itinerary
            </h2>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-4 rounded-full" />
            <p className="max-w-md mx-auto text-sm text-gray-500 pt-2">
              Select your preferences and get an instant custom quote/itinerary template sent directly to our reservation desk.
            </p>
          </div>

          <div className="bg-white border border-black/5 rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      customizerStep >= stepNum
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                        customizerStep > stepNum ? 'bg-orange-500' : 'bg-gray-100'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* STEP 1: DESTINATION */}
            {customizerStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 text-center">Where do you want to explore?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'Maasai Mara', label: '🦁 Maasai Mara Safari', desc: 'Wildlife safari & game drives' },
                    { key: 'Diani Beach', label: '🏖️ Diani Beach Getaway', desc: 'Coastal powder-white sands' },
                    { key: 'Seychelles Islands', label: '🏝️ Seychelles Retreat', desc: 'UNESCO rainforests & bays' },
                    { key: 'Other / Customized', label: '🗺️ Custom Safari Route', desc: 'Design an original path' },
                  ].map((dest) => (
                    <button
                      key={dest.key}
                      type="button"
                      onClick={() => setSelectedDest(dest.key)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                        selectedDest === dest.key
                          ? 'border-orange-500 bg-orange-50/50 shadow-md ring-1 ring-orange-500'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="block font-bold text-gray-900 text-sm">{dest.label}</span>
                      <span className="block text-xs text-gray-500 mt-1">{dest.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    disabled={!selectedDest}
                    onClick={() => setCustomizerStep(2)}
                    className="inline-flex items-center gap-1 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition cursor-pointer"
                  >
                    Next Step <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TRAVEL STYLE */}
            {customizerStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 text-center">What is your travel style?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'Luxury Lodge', label: '✨ Luxury &amp; Wellness Lodge', desc: 'Five-star suites, private pools &amp; spas' },
                    { key: 'Adventure Camp', label: '🥾 Active Wilderness Adventure', desc: 'Safari treks, wild camping &amp; hikes' },
                    { key: 'Family Vacation', label: '👨‍👩‍👧‍👦 Family-Friendly Experience', desc: 'Spacious accommodation, kids activities' },
                    { key: 'Romantic Honeymoon', label: '💖 Couples &amp; Honeymooners', desc: 'Sunset private dinners, coastal cabins' },
                  ].map((style) => (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => setSelectedStyle(style.key)}
                      className={`p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                        selectedStyle === style.key
                          ? 'border-orange-500 bg-orange-50/50 shadow-md ring-1 ring-orange-500'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="block font-bold text-gray-900 text-sm">{style.label}</span>
                      <span className="block text-xs text-gray-500 mt-1">{style.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCustomizerStep(1)}
                    className="px-6 py-3.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer border border-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!selectedStyle}
                    onClick={() => setCustomizerStep(3)}
                    className="inline-flex items-center gap-1 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition cursor-pointer"
                  >
                    Next Step <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS */}
            {customizerStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 text-center">Customize Duration &amp; Group Size</h3>
                
                <div className="space-y-6 max-w-md mx-auto">
                  {/* Duration days slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-gray-700">
                      <span>Duration of Trip:</span>
                      <span className="text-orange-500 font-extrabold">{durationDays} Days</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                      <span>1 Day</span>
                      <span>7 Days</span>
                      <span>14 Days</span>
                    </div>
                  </div>

                  {/* Travelers count */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-gray-700">
                      <span>Number of Guests:</span>
                      <span className="text-orange-500 font-extrabold">{travelersCount} Guests</span>
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl p-1 bg-white max-w-[180px] mx-auto">
                      <button
                        type="button"
                        onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                        className="h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-extrabold text-lg text-gray-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm text-gray-900">{travelersCount}</span>
                      <button
                        type="button"
                        onClick={() => setTravelersCount(Math.min(20, travelersCount + 1))}
                        className="h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-extrabold text-lg text-gray-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCustomizerStep(2)}
                    className="px-6 py-3.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer border border-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomizerStep(4)}
                    className="inline-flex items-center gap-1 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 transition cursor-pointer"
                  >
                    Next Step <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT & SUBMIT */}
            {customizerStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                {!customizerSuccess ? (
                  <form onSubmit={handleCustomizerSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 text-center">Contact Information</h3>
                    <p className="text-center text-xs text-gray-500 max-w-sm mx-auto">
                      Fill in your email details below. We will instantly launch your email application with a preformatted quote inquiry.
                    </p>

                    <div className="space-y-4 max-w-md mx-auto">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm font-semibold text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm font-semibold text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={() => setCustomizerStep(3)}
                        className="px-6 py-3.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer border border-gray-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-orange-500 hover:bg-orange-600 transition cursor-pointer"
                      >
                        Generate Quote Request
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-6 py-4 animate-scaleUp">
                    <div className="h-16 w-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-md border border-green-200">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-gray-900">Custom Inquiry Generated!</h4>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                        We have opened your email client with the custom template. If it didn't open, please email us directly at{' '}
                        <strong className="text-orange-500 font-extrabold">reservations@graphivio.com</strong>.
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left max-w-md mx-auto space-y-3 shadow-inner">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Plan Summary</h5>
                      <p className="text-xs font-semibold text-gray-700">📍 Destination: <strong className="text-gray-950 font-bold">{selectedDest}</strong></p>
                      <p className="text-xs font-semibold text-gray-700">✨ Travel Style: <strong className="text-gray-950 font-bold">{selectedStyle}</strong></p>
                      <p className="text-xs font-semibold text-gray-700">🗓️ Trip Duration: <strong className="text-gray-950 font-bold">{durationDays} Days</strong></p>
                      <p className="text-xs font-semibold text-gray-700">👥 Total Guests: <strong className="text-gray-950 font-bold">{travelersCount} Guests</strong></p>
                      <p className="text-xs font-semibold text-gray-700">👤 Guest Name: <strong className="text-gray-950 font-bold">{contactName}</strong></p>
                    </div>
                    <button
                      type="button"
                      onClick={resetCustomizer}
                      className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-orange-500 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Start Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-orange-500">
              Traveler Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>What Our Explorers Say</h2>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-4 rounded-full" />
            <p className="max-w-lg mx-auto text-sm text-gray-500 pt-2">
              Honest, verified reviews from real travelers who booked their expeditions through Graphivio.
            </p>
          </div>

          {latestReviews && latestReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestReviews.map((review) => {
                const initials = review.user?.name
                  ? review.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : '??';
                const avatarColors = ['#005F73', '#0A9396', '#94D2BD', '#EE9B00', '#CA6702', '#AE2012'];
                const color = avatarColors[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % avatarColors.length];
                return (
                  <div
                    key={review.id}
                    className="p-8 rounded-3xl flex flex-col gap-5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-black/5 bg-[#FFF9F4]"
                  >
                    {/* Stars & Verification Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4"
                            style={{
                              fill: i < review.rating ? '#EE9B00' : 'transparent',
                              color: i < review.rating ? '#EE9B00' : '#CBD5E1',
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2.5 py-1 rounded-full tracking-wide">
                        ✓ Verified Explorer
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-sm italic leading-relaxed text-gray-600 flex-1">
                      &ldquo;{review.reviewText}&rdquo;
                    </p>

                    {/* Tour badge */}
                    {review.tour && (
                      <span
                        className="inline-block text-[11px] font-extrabold px-3 py-1.5 rounded-full self-start shadow-sm border border-cyan-100"
                        style={{ background: 'rgba(0,95,115,0.08)', color: '#005F73' }}
                      >
                        📍 {review.tour.title}
                      </span>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-black/5">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-inner"
                        style={{ background: color }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{review.user?.name || 'Explorer'}</h4>
                        <p className="text-[10px] text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state — shown before any reviews exist */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  text: '"Our safari at Maasai Mara was absolutely outstanding. The guides were exceptionally knowledgeable, and seeing a leopard hunt at sunrise was magical."',
                  author: 'Sarah Mitchell', trip: 'Maasai Mara Safari, Oct 2025', initials: 'SM', rating: 5,
                },
                {
                  text: '"Diani Beach is paradise! The powder-white sand, clear turquoise waters, and direct ocean breezes were perfect. Booking via Graphivio was incredibly smooth!"',
                  author: 'David Kim', trip: 'Diani Beach Getaway, Aug 2025', initials: 'DK', rating: 5,
                },
              ].map(({ text, author, trip, initials, rating }) => (
                <div key={author} className="p-8 rounded-3xl space-y-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/5 bg-[#FFF9F4]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4" style={{ fill: i < rating ? '#EE9B00' : 'transparent', color: i < rating ? '#EE9B00' : '#CBD5E1' }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2.5 py-1 rounded-full tracking-wide">
                      ✓ Verified Explorer
                    </span>
                  </div>
                  <p className="text-sm italic leading-relaxed text-gray-600">{text}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner" style={{ background: '#005F73' }}>
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{author}</h4>
                      <p className="text-xs text-gray-400">{trip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SUSTAINABILITY & IMPACT STRIP ===== */}
      <section className="py-16 text-white" style={{ bgGradient: 'linear-gradient(135deg, #005F73 0%, #0F2027 100%)', background: '#005F73' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                <Leaf className="h-3 w-3" /> Eco-Conscious Travel
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white">Exploring Responsibly</h3>
              <p className="text-sm text-white/80 max-w-sm">
                We believe in travel that preserves nature, empowers communities, and leaves a positive impact on local habitats.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { count: '5%', label: 'Local Impact Fund', desc: 'Of booking revenues go to Maasai education & conservation.' },
                { count: '100%', label: 'Locally Guided', desc: 'All field guides are local residents certified in wildlife protection.' },
                { count: 'Eco', label: 'Certified Lodges', desc: 'Partnered with lodges utilizing solar energy & zero single-use plastic.' }
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
                  <span className="block text-3xl font-black text-orange-400">{stat.count}</span>
                  <span className="block text-xs font-bold text-white mt-1 uppercase tracking-wider">{stat.label}</span>
                  <span className="block text-[11px] text-white/70 mt-1 leading-relaxed">{stat.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FREQUENTLY ASKED QUESTIONS (FAQ) ===== */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-orange-500">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
              Traveler Intelligence
            </h2>
            <div className="h-1 w-12 bg-orange-500 mx-auto mt-4 rounded-full" />
            <p className="max-w-md mx-auto text-sm text-gray-500 pt-2">
              Get direct answers to general inquiries about planning, booking, and experiencing trips with Graphivio.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'When is the best time to experience the Maasai Mara Wildebeest Migration?',
                a: 'The Great Wildebeest Migration typically takes place between July and October every year. During this window, over two million animals migrate from the Serengeti to the Maasai Mara. We recommend booking at least 6 months in advance for migration season.'
              },
              {
                q: 'Can Graphivio design a customized or private itinerary for my group?',
                a: 'Absolutely! More than 70% of our bookings are fully tailored itineraries. You can use our Interactive Trip Builder above, or select "All Packages" and submit a request indicating your custom route details.'
              },
              {
                q: 'What is your refund and cancellation policy?',
                a: 'We offer flexible cancellations. If you cancel at least 30 days prior to departure, you will receive a 100% refund (excluding non-refundable national park permits where applicable). Cancellations within 14-30 days are eligible for a 50% refund or a full trip credit code.'
              },
              {
                q: 'Are local national park entry fees included in the prices?',
                a: 'Yes, unless specifically stated otherwise on the package description, all standard conservation entry fees and guide permits for Kenyan reserves & Seychelles parks are fully covered in the tour package price.'
              },
              {
                q: 'What vaccination and entry travel documents are required?',
                a: 'For Kenya, tourists require a valid passport and an electronic travel authorization (eTA). For yellow fever endemic zones, a valid vaccination certificate is required. Seychelles requires a digital embarkation card completed online. Our support guides help handle all documentation during booking.'
              }
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-black/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md bg-[#FFF9F4]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition focus:outline-none"
                  >
                    <span className="font-bold text-gray-900 text-sm sm:text-base pr-4 flex items-center gap-2.5">
                      <HelpCircle className="h-5 w-5 text-orange-500 shrink-0" />
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-orange-500' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-black/5' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 bg-white text-sm text-gray-600 leading-relaxed">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA STRIP — Working Video Background ===== */}
      <section className="relative py-36 text-center overflow-hidden">
        {/* Video background using Mixkit CDN */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-resort-43181-large.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Deep colour overlay mask */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.85) 0%, rgba(0,95,115,0.92) 100%)',
          }}
        />

        <div className="relative z-20 mx-auto max-w-3xl px-4">
          <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-xl tracking-tight text-white uppercase">
            Ready for Your Next Adventure?
          </h2>
          <p className="mb-10 text-lg md:text-xl font-medium text-white/95 leading-relaxed">
            Browse our handcrafted tours and let us take care of every detail.
          </p>
          <a
            href="/tours"
            className="inline-flex items-center gap-2 px-12 py-5 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-105 active:scale-[0.98] shadow-2xl hover:shadow-white/10"
            style={{ background: '#FFFFFF', color: '#0F2027' }}
          >
            Browse All Tours →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
