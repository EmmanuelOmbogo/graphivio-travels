'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Tour, Review } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TourCard } from '@/components/TourCard';
import { Compass, ShieldCheck, Map, Users, Search, Star, Volume2, VolumeX } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDifficulty, setSearchDifficulty] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

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

      {/* ===== HERO — Video Background ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background video */}
        <video
          ref={heroVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source
            src="https://videos.pexels.com/video-files/1826157/1826157-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          {/* Fallback clip */}
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background:
              'linear-gradient(to bottom, rgba(5,10,20,0.55) 0%, rgba(5,10,20,0.45) 60%, rgba(5,10,20,0.75) 100%)',
          }}
        />

        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted((m) => !m)}
          title={isMuted ? 'Unmute video' : 'Mute video'}
          className="absolute bottom-6 right-6 z-20 flex items-center justify-center h-10 w-10 rounded-full backdrop-blur-md border transition hover:opacity-90 cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.25)', color: '#FFFFFF' }}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 py-28 sm:py-36">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold border backdrop-blur-sm"
            style={{ color: '#EE9B00', background: 'rgba(238,155,0,0.15)', borderColor: 'rgba(238,155,0,0.4)' }}
          >
            <Compass className="h-3.5 w-3.5 animate-spin-slow" />
            Explore the Unexplored
          </span>

          <h1
            className="text-5xl font-extrabold tracking-tight sm:text-7xl max-w-4xl mx-auto leading-tight drop-shadow-2xl"
            style={{ color: '#FFFFFF' }}
          >
            Crafting Unforgettable{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #EE9B00, #56CFE1)',
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
            className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed drop-shadow-md"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Discover customized plans, curated local guides, and top-tier accommodations.
            Start searching your next dream holiday today.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto max-w-3xl p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            <div className="relative flex-1 w-full">
              <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#789CA5' }} />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Where to? (e.g. Japan, Peru…)"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(0,95,115,0.18)',
                  color: '#0F2027',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,95,115,0.18)')}
              />
            </div>

            <div className="relative w-full md:w-56">
              <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: '#789CA5' }} />
              <select
                value={searchDifficulty}
                onChange={(e) => setSearchDifficulty(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm appearance-none focus:outline-none transition cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(0,95,115,0.18)',
                  color: '#0F2027',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,95,115,0.18)')}
              >
                <option value="">Any Difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="DIFFICULT">Difficult</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition hover:opacity-90 cursor-pointer shadow-lg"
              style={{ background: '#EE9B00', color: '#FFFFFF' }}
            >
              <Search className="h-5 w-5" />
              <span>Search Tours</span>
            </button>
          </form>

          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-2 pt-4 animate-bounce">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Scroll to explore</span>
            <svg className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== FEATURED TOURS ===== */}
      <section className="py-20 bg-white" style={{ borderBottom: '1px solid rgba(0,95,115,0.08)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#EE9B00' }}>
              Our Picks
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: '#0F2027' }}>
              Featured Adventures
            </h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: '#4A6B74' }}>
              Hand-picked journeys vetted for the highest satisfaction, scenic beauty, and authentic cultural immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition hover:opacity-90 shadow-sm"
              style={{ background: '#005F73', color: '#FFFFFF' }}
            >
              View All Tours →
            </a>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION ===== */}
      <section className="py-20" style={{ background: '#FFF9F4', borderBottom: '1px solid rgba(0,95,115,0.08)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#EE9B00' }}>
              Why Graphivio
            </span>
            <h2 className="text-3xl font-bold" style={{ color: '#0F2027' }}>We Raise the Bar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Secure Bookings', body: '100% money-back guarantee, flexible cancellation, and verified secure checkouts on every booking.' },
              { icon: Map, title: 'Curated Itineraries', body: 'Each destination is scouted by local experts to deliver original, deeply immersive, non-generic experiences.' },
              { icon: Users, title: 'Local Guides', body: 'Support local communities while discovering culture, history, and the hidden secrets of each region.' },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-7 rounded-2xl shadow-sm"
                style={{ background: '#FFFFFF', border: '1px solid rgba(0,95,115,0.12)' }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5"
                  style={{ background: 'rgba(0,95,115,0.06)', border: '1px solid rgba(0,95,115,0.12)' }}
                >
                  <Icon className="h-7 w-7" style={{ color: '#005F73' }} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0F2027' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4A6B74' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#EE9B00' }}>
              Traveler Reviews
            </span>
            <h2 className="text-3xl font-bold" style={{ color: '#0F2027' }}>What Our Explorers Say</h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: '#4A6B74' }}>
              Honest, verified reviews from real travelers who booked their expeditions through Graphivio.
            </p>
          </div>

          {latestReviews && latestReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestReviews.map((review) => {
                const initials = review.user?.name
                  ? review.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  : '??';
                const avatarColors = ['#005F73', '#0A9396', '#94D2BD', '#EE9B00', '#CA6702', '#AE2012'];
                const color = avatarColors[(initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % avatarColors.length];
                return (
                  <div
                    key={review.id}
                    className="p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                    style={{ background: '#FFF9F4', border: '1px solid rgba(0,95,115,0.12)' }}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5"
                          style={{
                            fill: i < review.rating ? '#EE9B00' : 'transparent',
                            color: i < review.rating ? '#EE9B00' : '#CBD5E1',
                          }}
                        />
                      ))}
                      <span className="ml-1.5 text-[11px] font-bold" style={{ color: '#EE9B00' }}>{review.rating}.0</span>
                    </div>

                    {/* Review text */}
                    <p className="text-sm italic leading-relaxed flex-1" style={{ color: '#4A6B74' }}>
                      &ldquo;{review.reviewText}&rdquo;
                    </p>

                    {/* Tour badge */}
                    {review.tour && (
                      <span
                        className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full self-start"
                        style={{ background: 'rgba(0,95,115,0.08)', color: '#005F73' }}
                      >
                        📍 {review.tour.title}
                      </span>
                    )}

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'rgba(0,95,115,0.08)' }}>
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{ background: color, color: '#FFFFFF' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold" style={{ color: '#0F2027' }}>{review.user?.name || 'Explorer'}</h4>
                        <p className="text-[10px]" style={{ color: '#789CA5' }}>
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
                <div key={author} className="p-7 rounded-2xl space-y-4 shadow-sm" style={{ background: '#FFF9F4', border: '1px solid rgba(0,95,115,0.12)' }}>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4" style={{ fill: i < rating ? '#EE9B00' : 'transparent', color: i < rating ? '#EE9B00' : '#CBD5E1' }} />
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed" style={{ color: '#4A6B74' }}>{text}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#005F73', color: '#FFFFFF' }}>
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: '#0F2027' }}>{author}</h4>
                      <p className="text-xs" style={{ color: '#789CA5' }}>{trip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA STRIP — Video Background ===== */}
      <section className="relative py-28 text-center overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Deep colour overlay */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(238,155,0,0.82) 0%, rgba(0,95,115,0.88) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg" style={{ color: '#FFFFFF' }}>
            Ready for Your Next Adventure?
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Browse our handcrafted tours and let us take care of every detail.
          </p>
          <a
            href="/tours"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-extrabold text-base transition hover:scale-105 shadow-2xl"
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
