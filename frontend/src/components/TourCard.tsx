import React from 'react';
import Link from 'next/link';
import { Tour } from '../types';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
}

const difficultyStyles: Record<string, { color: string; bg: string; border: string }> = {
  EASY: { color: '#059669', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)' },
  MEDIUM: { color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' },
  DIFFICULT: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)' },
};

export function TourCard({ tour }: TourCardProps) {
  const diff = difficultyStyles[tour.difficulty] ?? difficultyStyles.MEDIUM;

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ background: '#FFFFFF', border: '1px solid rgba(0, 95, 115, 0.12)' }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={tour.imageCover}
          alt={tour.title}
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
          >
            {tour.difficulty}
          </span>
        </div>

        {/* Price Tag */}
        <div
          className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0, 95, 115, 0.15)' }}
        >
          <span className="text-xs font-medium" style={{ color: '#4A6B74' }}>From </span>
          <span className="text-sm font-bold" style={{ color: '#D97706' }}>KSh {tour.price.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="space-y-2">
          {/* Location & Duration */}
          <div className="flex items-center justify-between text-xs" style={{ color: '#789CA5' }}>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#EE9B00' }} />
              <span>{tour.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#789CA5' }} />
              <span>{tour.durationDays} Days</span>
            </span>
          </div>

          <h3
            className="text-lg font-bold transition duration-200 line-clamp-1"
            style={{ color: '#0F2027' }}
          >
            {tour.title}
          </h3>

          <p className="text-sm line-clamp-2 min-h-[40px]" style={{ color: '#4A6B74' }}>
            {tour.description}
          </p>
        </div>

        {/* Rating and Link */}
        <div
          className="mt-auto pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,95,115,0.1)' }}
        >
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" style={{ fill: '#EE9B00', color: '#EE9B00' }} />
            <span className="text-sm font-bold" style={{ color: '#0F2027' }}>
              {tour.ratingsAverage.toFixed(1)}
            </span>
            <span className="text-xs" style={{ color: '#789CA5' }}>({tour.ratingsQuantity})</span>
          </div>

          <Link
            href={`/tours/${tour.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold transition cursor-pointer hover:opacity-80"
            style={{ color: '#EE9B00' }}
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
