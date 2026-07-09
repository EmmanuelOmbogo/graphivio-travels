'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Tour } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TourCard } from '@/components/TourCard';
import { Star, Search, SlidersHorizontal, Loader2, Map } from 'lucide-react';

function ToursContent() {
  const searchParams = useSearchParams();

  // Read all possible query params from URL
  const urlSearch = searchParams.get('search') || '';
  const urlLocation = searchParams.get('location') || '';
  const urlDifficulty = searchParams.get('difficulty') || '';
  const urlCategory = searchParams.get('category') || '';

  const [locationInput, setLocationInput] = useState(urlSearch || urlLocation);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [appliedFilter, setAppliedFilter] = useState(urlSearch || urlLocation);
  const [activeDifficulty, setActiveDifficulty] = useState(urlDifficulty);

  useEffect(() => {
    const newFilter = searchParams.get('search') || searchParams.get('location') || '';
    const newDiff = searchParams.get('difficulty') || '';
    setLocationInput(newFilter);
    setAppliedFilter(newFilter);
    setActiveDifficulty(newDiff);
  }, [searchParams]);

  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ['tours', appliedFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedFilter) params.set('location', appliedFilter);
      const res = await api.get(`/tours?${params.toString()}`);
      return res.data;
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilter(locationInput);
    setActiveDifficulty('');
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
      title: 'Nairobi National Park Tour',
      description: "Discover the world's only game reserve located within a major capital city. Photograph wildlife with the skyline in the background.",
      price: 15000, durationDays: 1, location: 'Nairobi, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
      images: [], maxGroupSize: 12, difficulty: 'EASY', ratingsAverage: 4.5, ratingsQuantity: 11445, active: true, itinerary: [], createdAt: '',
    },
    {
      id: '3',
      title: 'Diani Beach Tropical Getaway',
      description: "Unwind at Kenya's premier beach paradise. Diani Beach boasts flawless powder-white sand, sparkling turquoise waters, and Swahili coastal forests.",
      price: 45000, durationDays: 4, location: 'Diani, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=800&q=80',
      images: [], maxGroupSize: 10, difficulty: 'EASY', ratingsAverage: 4.7, ratingsQuantity: 2086, active: true, itinerary: [], createdAt: '',
    },
    {
      id: '4',
      title: 'Vallée de Mai UNESCO Reserve Expedition',
      description: 'Explore the prehistoric rainforest of Vallée de Mai on Praslin Island, Seychelles. Home of the giant, uniquely shaped Coco de Mer palm trees.',
      price: 60000, durationDays: 2, location: 'Praslin, Seychelles',
      imageCover: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
      images: [], maxGroupSize: 8, difficulty: 'MEDIUM', ratingsAverage: 4.3, ratingsQuantity: 1919, active: true, itinerary: [], createdAt: '',
    },
  ];

  // Category keyword mapping for navbar dropdown links
  const categoryKeywords: Record<string, string[]> = {
    safari: ['safari', 'mara', 'wildlife', 'game', 'reserve', 'national park'],
    beach: ['beach', 'diani', 'coastal', 'ocean', 'island'],
    honeymoon: ['honeymoon', 'romantic', 'couple', 'seychelles', 'resort'],
    balloon: ['balloon', 'air'],
    expedition: ['expedition', 'rainforest', 'forest', 'hike', 'trek', 'UNESCO'],
    car: ['car', 'hire', 'drive', 'transfer'],
  };

  // Process sorting & all active filters
  const processTours = () => {
    let result = tours && tours.length > 0 ? [...tours] : [...mockTours];

    // Text / location filter (from search bar or ?search= / ?location= params)
    if (appliedFilter) {
      result = result.filter(t =>
        t.location.toLowerCase().includes(appliedFilter.toLowerCase()) ||
        t.title.toLowerCase().includes(appliedFilter.toLowerCase()) ||
        t.description.toLowerCase().includes(appliedFilter.toLowerCase())
      );
    }

    // Difficulty filter (from ?difficulty= param)
    if (activeDifficulty) {
      result = result.filter(t => t.difficulty === activeDifficulty);
    }

    // Category keyword filter (from ?category= or ?search= param)
    const catKey = urlCategory.toLowerCase();
    if (catKey && categoryKeywords[catKey]) {
      result = result.filter(t =>
        categoryKeywords[catKey].some(kw =>
          t.title.toLowerCase().includes(kw) ||
          t.description.toLowerCase().includes(kw) ||
          t.location.toLowerCase().includes(kw)
        )
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'rating') {
      result.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    }

    return result;
  };

  const finalTours = processTours();

  // Compute human-readable page title based on active filters
  const pageTitle = (() => {
    if (activeDifficulty === 'EASY') return 'Easy Sightseeing Tours';
    if (activeDifficulty === 'MEDIUM') return 'Medium Trek Adventures';
    if (activeDifficulty === 'DIFFICULT') return 'Challenging Expedition Climbs';
    if (urlCategory === 'safari') return 'Wildlife Safari Tours';
    if (urlCategory === 'beach') return 'Coastal Beach Escapes';
    if (urlCategory === 'honeymoon') return 'Romantic Getaways';
    if (urlCategory === 'balloon') return 'Hot Air Balloon Safaris';
    if (urlCategory === 'expedition') return 'Rainforest Expedition Hikes';
    if (appliedFilter) return `Results for "${appliedFilter}"`;
    return 'Explore All Adventures';
  })();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
            {pageTitle}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#4A6B74' }}>
            {finalTours.length > 0
              ? `${finalTours.length} tour${finalTours.length !== 1 ? 's' : ''} found — curated experiences in Kenya & beyond.`
              : 'Discover customized plans and curated experiences in Kenya & Seychelles.'}
          </p>
          {/* Active filter pills */}
          {(appliedFilter || activeDifficulty || urlCategory) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {appliedFilter && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600">
                  📍 {appliedFilter}
                  <button onClick={() => { setAppliedFilter(''); setLocationInput(''); }} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}
              {activeDifficulty && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                  🎯 {activeDifficulty.charAt(0) + activeDifficulty.slice(1).toLowerCase()}
                  <button onClick={() => setActiveDifficulty('')} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                </span>
              )}
              {urlCategory && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                  🏷️ {urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Horizontal Filter Bar ── */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 p-3 rounded-2xl"
          style={{ background: '#FFF9F4', border: '1px solid rgba(0,95,115,0.15)' }}
        >
          {/* Destination Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Search by destination..."
                className="w-full pl-3 pr-9 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{ background: '#FFFFFF', border: '1px solid rgba(0,95,115,0.18)', color: '#0F2027' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,95,115,0.18)')}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 transition hover:opacity-80"
                style={{ color: '#EE9B00' }}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {appliedFilter && (
              <button
                type="button"
                onClick={() => { setLocationInput(''); setAppliedFilter(''); }}
                className="text-xs font-bold hover:underline cursor-pointer text-red-500 whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 self-center" style={{ background: 'rgba(0,95,115,0.12)' }} />

          {/* Price / Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4" style={{ color: '#EE9B00' }} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-sm font-semibold"
              style={{ color: '#0F2027' }}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#EE9B00' }} />
            <span className="text-sm font-semibold" style={{ color: '#4A6B74' }}>Searching our atlas...</span>
          </div>
        ) : finalTours.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center border border-dashed p-16 rounded-2xl text-center"
            style={{ borderColor: 'rgba(0, 95, 115, 0.18)' }}
          >
            <Map className="h-12 w-12 mb-4" style={{ color: '#EE9B00' }} />
            <h3 className="text-lg font-bold" style={{ color: '#0F2027' }}>No tours found</h3>
            <p className="text-sm max-w-sm mt-1" style={{ color: '#789CA5' }}>
              We couldn't find any journeys matching your criteria. Try adjusting your search or location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#EE9B00' }} />
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}
