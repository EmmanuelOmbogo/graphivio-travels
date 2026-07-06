'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Booking } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Calendar, Users, DollarSign, Loader2, Compass, CheckCircle2, Clock, XCircle, Ban } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, authLoading, router]);

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my-bookings');
      return res.data;
    },
    enabled: !!user,
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await api.patch(`/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#EE9B00' }} />
        <span className="font-semibold text-sm animate-pulse" style={{ color: '#4A6B74' }}>Restoring explorer credentials...</span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Visual status timeline component
  const StatusTimeline = ({ status }: { status: string }) => {
    const isCancelled = status === 'CANCELLED';
    const steps = isCancelled
      ? [
          { label: 'Booked', done: true },
          { label: 'Cancelled', done: true, cancelled: true },
        ]
      : [
          { label: 'Pending', done: status === 'PENDING' || status === 'PAID' },
          { label: 'Confirmed', done: status === 'PAID' },
          { label: 'Completed', done: status === 'PAID' },
        ];

    return (
      <div className="flex items-center gap-0 mt-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all"
                style={{
                  background: step.cancelled
                    ? 'rgba(239,68,68,0.12)'
                    : step.done
                    ? 'rgba(0,95,115,0.12)'
                    : 'rgba(0,0,0,0.04)',
                  borderColor: step.cancelled
                    ? '#dc2626'
                    : step.done
                    ? '#005F73'
                    : 'rgba(0,0,0,0.15)',
                  color: step.cancelled ? '#dc2626' : step.done ? '#005F73' : '#94a3b8',
                }}
              >
                {step.cancelled ? '✕' : step.done ? '✓' : i + 1}
              </div>
              <span
                className="text-[9px] font-semibold whitespace-nowrap"
                style={{
                  color: step.cancelled
                    ? '#dc2626'
                    : step.done
                    ? '#005F73'
                    : '#94a3b8',
                }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div
                className="h-0.5 w-8 sm:w-12 mb-4 mx-1"
                style={{
                  background:
                    isCancelled && i === 0
                      ? '#dc2626'
                      : steps[i + 1]?.done
                      ? '#005F73'
                      : 'rgba(0,0,0,0.1)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-5xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
              My Expeditions Board
            </h1>
            <p className="text-sm mt-1" style={{ color: '#4A6B74' }}>
              Review your booked tours, payment receipts, and travel logs.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#EE9B00' }} />
              <span className="text-xs font-semibold" style={{ color: '#789CA5' }}>Pulling travel records...</span>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border"
                  style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.15)' }}
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Tour Mini Image */}
                    <div className="relative aspect-[16/10] w-full sm:w-36 rounded-xl overflow-hidden bg-slate-100 border flex-shrink-0"
                      style={{ borderColor: 'rgba(0, 95, 115, 0.12)' }}>
                      <img
                        src={booking.tour?.imageCover || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80'}
                        alt={booking.tour?.title || 'Tour cover'}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Booking metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(booking.status)}`}
                        >
                          {booking.status === 'PAID' && <CheckCircle2 className="h-3 w-3" />}
                          {booking.status === 'PENDING' && <Clock className="h-3 w-3" />}
                          {booking.status === 'CANCELLED' && <Ban className="h-3 w-3" />}
                          {booking.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase" style={{ color: '#789CA5' }}>ID: {booking.id.slice(0, 8)}</span>
                      </div>

                      <h3 className="text-lg font-bold leading-snug" style={{ color: '#0F2027' }}>
                        {booking.tour?.title || 'Unknown Expedition'}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-xs font-semibold" style={{ color: '#4A6B74' }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" style={{ color: '#EE9B00' }} />
                          <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" style={{ color: '#EE9B00' }} />
                          <span>{booking.travelersCount} Traveler(s)</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" style={{ color: '#EE9B00' }} />
                          <span style={{ color: '#0F2027' }}>Total: KSh {booking.price.toLocaleString()}</span>
                        </span>
                      </div>

                      {/* Status timeline */}
                      <StatusTimeline status={booking.status} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0"
                    style={{ borderTopColor: 'rgba(0, 95, 115, 0.08)' }}>
                    <Link
                      href={`/tours/${booking.tourId}`}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition hover:opacity-90 shadow-sm"
                      style={{ background: '#005F73', color: '#FFFFFF' }}
                    >
                      View Dossier
                    </Link>

                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this booking?')) {
                            cancelMutation.mutate(booking.id);
                          }
                        }}
                        disabled={cancelMutation.isPending}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 border"
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: '#DC2626',
                          borderColor: 'rgba(239, 68, 68, 0.25)',
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed rounded-2xl p-16 text-center space-y-4 max-w-lg mx-auto"
              style={{ borderColor: 'rgba(0, 95, 115, 0.18)', background: '#FFF9F4' }}>
              <Compass className="h-12 w-12 mx-auto" style={{ color: '#EE9B00' }} />
              <h3 className="text-lg font-bold" style={{ color: '#0F2027' }}>No active bookings</h3>
              <p className="text-sm" style={{ color: '#789CA5' }}>
                You haven't scheduled any journeys yet. Tap below to search and secure your first adventure.
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center justify-center font-bold px-6 py-2.5 rounded-xl text-sm transition hover:opacity-90 shadow-md"
                style={{ background: '#EE9B00', color: '#FFFFFF' }}
              >
                Find Expeditions
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
