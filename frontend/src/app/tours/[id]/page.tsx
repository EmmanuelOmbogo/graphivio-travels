'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Tour, Review } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookingModal } from '@/components/BookingModal';
import { useAuth } from '@/context/AuthContext';
import { 
  MapPin, Clock, Users, Shield, Star, Calendar, MessageSquare, 
  ArrowLeft, ChevronRight, CheckCircle2, Loader2, Compass 
} from 'lucide-react';
import Link from 'next/link';

interface TourDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TourDetailsPage({ params }: TourDetailsPageProps) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const router = useRouter();
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch tour details
  const { data: tour, isLoading, refetch: refetchTour } = useQuery<Tour>({
    queryKey: ['tour', id],
    queryFn: async () => {
      const res = await api.get(`/tours/${id}`);
      return res.data;
    },
  });

  // Fetch reviews for this tour
  const { data: reviews, refetch: refetchReviews } = useQuery<Review[]>({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await api.get(`/tours/${id}/reviews`);
      return res.data;
    },
    enabled: !!id,
  });

  const mockTours: Record<string, Tour> = {
    '1': {
      id: '1',
      title: 'Maasai Mara National Reserve Safari',
      description: "Experience the crown jewel of Kenya's wildlife viewing. Maasai Mara is world-famous for its exceptional population of lions, leopards, cheetahs, and the Great Migration (July–October).",
      price: 180000, durationDays: 4, location: 'Maasai Mara, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=600&q=80'
      ],
      maxGroupSize: 8, difficulty: 'EASY', ratingsAverage: 4.7, ratingsQuantity: 3505, active: true,
      itinerary: [
        { day: 1, title: 'Arrival & Game Drive', description: 'Arrive at the lodge and embark on an afternoon game drive to spot the Big Five.' },
        { day: 2, title: 'Great Migration Experience', description: 'Spend a full day witnessing the drama of the Great Migration crossing the Mara River.' }
      ],
      createdAt: '',
    },
    '2': {
      id: '2',
      title: 'Nairobi National Park Tour',
      description: "Discover the world's only game reserve located within a major capital city. Photograph black rhinos, lions, and zebras against a skyline of skyscrapers.",
      price: 15000, durationDays: 1, location: 'Nairobi, Kenya',
      imageCover: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80'
      ],
      maxGroupSize: 12, difficulty: 'EASY', ratingsAverage: 4.5, ratingsQuantity: 11445, active: true,
      itinerary: [
        { day: 1, title: 'City Safari Drive', description: 'Early morning game drive inside Nairobi National Park, followed by a local Swahili barbecue.' }
      ],
      createdAt: '',
    },
  };

  const currentTour = tour || mockTours[id] || mockTours['1'];

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setSubmittingReview(true);

    try {
      await api.post(`/tours/${id}/reviews`, {
        rating: reviewRating,
        reviewText,
      });
      setReviewText('');
      refetchTour();
      refetchReviews();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading && !currentTour) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#EE9B00' }} />
        <span className="font-semibold text-sm animate-pulse" style={{ color: '#4A6B74' }}>Loading expedition dossier...</span>
      </div>
    );
  }

  if (!currentTour) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Compass className="h-12 w-12 animate-spin-slow" style={{ color: '#EE9B00' }} />
        <span className="text-xl font-bold" style={{ color: '#0F2027' }}>Tour Dossier Not Found</span>
        <Link href="/tours" className="font-bold hover:underline flex items-center gap-1" style={{ color: '#EE9B00' }}>
          <ArrowLeft className="h-4 w-4" /> Back to Tours
        </Link>
      </div>
    );
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'MEDIUM':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'DIFFICULT':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative aspect-[21/9] w-full min-h-[360px] bg-slate-900 overflow-hidden border-b"
        style={{ borderBottomColor: 'rgba(0, 95, 115, 0.15)' }}>
        <img
          src={currentTour.imageCover}
          alt={currentTour.title}
          className="h-full w-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
          <Link href="/tours"
            className="inline-flex items-center gap-1.5 text-xs font-bold backdrop-blur-md px-3 py-1.5 rounded-full border transition hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Catalog</span>
          </Link>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {currentTour.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-200 items-center">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" style={{ color: '#EE9B00' }} />
              <span>{currentTour.location}</span>
            </span>
            <div className="h-3.5 w-px bg-white/20" />
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-slate-300" />
              <span>{currentTour.durationDays} Days</span>
            </span>
            <div className="h-3.5 w-px bg-white/20" />
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white">{currentTour.ratingsAverage.toFixed(1)}</span>
              <span>({currentTour.ratingsQuantity} Reviews)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <main className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold pb-2 border-b" style={{ color: '#0F2027', borderBottomColor: 'rgba(0, 95, 115, 0.12)' }}>
              Tour Expedition Overview
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#4A6B74' }}>
              {currentTour.description}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 rounded-2xl"
            style={{ background: '#FFF9F4', border: '1px solid rgba(0, 95, 115, 0.15)' }}>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold block uppercase" style={{ color: '#789CA5' }}>Difficulty Level</span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDifficultyColor(currentTour.difficulty)}`}>
                {currentTour.difficulty}
              </span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold block uppercase" style={{ color: '#789CA5' }}>Max Group Size</span>
              <span className="text-sm font-bold flex items-center justify-center sm:justify-start gap-1" style={{ color: '#0F2027' }}>
                <Users className="h-4 w-4" style={{ color: '#EE9B00' }} />
                {currentTour.maxGroupSize} People
              </span>
            </div>
            <div className="space-y-1 text-center sm:text-left col-span-2 sm:col-span-1">
              <span className="text-xs font-bold block uppercase" style={{ color: '#789CA5' }}>Insurance Covered</span>
              <span className="text-sm font-bold flex items-center justify-center sm:justify-start gap-1" style={{ color: '#0F2027' }}>
                <Shield className="h-4 w-4 text-emerald-600" />
                Full Coverage
              </span>
            </div>
          </div>

          {/* Gallery */}
          {currentTour.images && currentTour.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold pb-2 border-b" style={{ color: '#0F2027', borderBottomColor: 'rgba(0, 95, 115, 0.12)' }}>
                Expedition Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentTour.images.map((imgUrl, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border"
                    style={{ borderColor: 'rgba(0, 95, 115, 0.12)' }}>
                    <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {currentTour.itinerary && currentTour.itinerary.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold pb-2 border-b" style={{ color: '#0F2027', borderBottomColor: 'rgba(0, 95, 115, 0.12)' }}>
                Expedition Itinerary
              </h2>
              <div className="relative pl-6 space-y-8 ml-4 border-l" style={{ borderLeftColor: 'rgba(0, 95, 115, 0.15)' }}>
                {currentTour.itinerary.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet */}
                    <div className="absolute -left-[35px] top-1 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center"
                      style={{ background: '#EE9B00', borderColor: '#FFFFFF' }} />
                    
                    <div className="space-y-1 p-5 rounded-2xl border"
                      style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.12)' }}>
                      <span className="text-xs font-extrabold uppercase tracking-widest block" style={{ color: '#EE9B00' }}>
                        Day {item.day}
                      </span>
                      <h4 className="text-sm font-bold" style={{ color: '#0F2027' }}>{item.title}</h4>
                      <p className="text-xs leading-relaxed mt-1" style={{ color: '#4A6B74' }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold pb-2 border-b" style={{ color: '#0F2027', borderBottomColor: 'rgba(0, 95, 115, 0.12)' }}>
              Traveler Testimonials
            </h2>
            
            {/* Reviews list */}
            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl space-y-3 border"
                    style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.12)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold" style={{ color: '#0F2027' }}>{rev.user?.name || 'Anonymous Explorer'}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#4A6B74' }}>{rev.reviewText}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs" style={{ color: '#789CA5' }}>No reviews published yet for this expedition. Be the first to leave one below!</p>
              )}
            </div>

            {/* Leave a review form */}
            {user ? (
              <form onSubmit={handleAddReview} className="p-6 rounded-2xl space-y-4 border"
                style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.15)' }}>
                <h3 className="text-sm font-bold" style={{ color: '#0F2027' }}>Write a Review</h3>
                
                {reviewError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                    {reviewError}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold" style={{ color: '#4A6B74' }}>Rating</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-amber-405 hover:scale-110 transition cursor-pointer"
                      >
                        <Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <textarea
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience during this journey..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs resize-none focus:outline-none transition bg-white"
                    style={{ border: '1px solid rgba(0, 95, 115, 0.18)', color: '#0F2027' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                  style={{ background: '#EE9B00', color: '#FFFFFF' }}
                >
                  {submittingReview ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Publish Review'}
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl text-center border border-dashed text-xs font-medium"
                style={{ borderColor: 'rgba(0, 95, 115, 0.18)', color: '#789CA5', background: '#FFF9F4' }}>
                Please{' '}
                <Link href={`/login?redirect=/tours/${id}`} className="font-bold hover:underline" style={{ color: '#EE9B00' }}>
                  sign in
                </Link>{' '}
                to publish your review.
              </div>
            )}
          </div>
        </div>

        {/* Right column - Booking Card Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-6 rounded-2xl shadow-xl space-y-6 border bg-white"
            style={{ borderColor: 'rgba(0, 95, 115, 0.15)' }}>
            <div className="flex justify-between items-center pb-4 border-b"
              style={{ borderBottomColor: 'rgba(0, 95, 115, 0.1)' }}>
              <div>
                <span className="text-xs font-bold block uppercase" style={{ color: '#789CA5' }}>Expedition Fare</span>
                <span className="text-2xl font-black" style={{ color: '#0F2027' }}>KSh {currentTour.price.toLocaleString()}</span>
                <span className="text-xs" style={{ color: '#4A6B74' }}> / per traveler</span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold px-2 py-0.5 rounded border"
                  style={{ color: '#EE9B00', background: 'rgba(238,155,0,0.06)', borderColor: 'rgba(238,155,0,0.25)' }}>
                  Instant Conf.
                </span>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs" style={{ color: '#4A6B74' }}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" style={{ color: '#EE9B00' }} />
                <span>Expert English-speaking guide</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" style={{ color: '#EE9B00' }} />
                <span>Accommodations & transports included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" style={{ color: '#EE9B00' }} />
                <span>Refreshments & meals specified</span>
              </li>
            </ul>

            <button
              onClick={() => {
                if (!user) {
                  router.push(`/login?redirect=/tours/${id}`);
                } else {
                  setIsBookingOpen(true);
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition hover:opacity-90 cursor-pointer shadow-md text-sm"
              style={{ background: '#EE9B00', color: '#FFFFFF' }}
            >
              <Calendar className="h-4 w-4" />
              <span>Book Expedition</span>
            </button>

            <p className="text-[10px] text-center" style={{ color: '#789CA5' }}>
              By confirming you agree to our 24h flexible cancelation terms.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        tour={currentTour}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
