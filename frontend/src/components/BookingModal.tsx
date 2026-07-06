'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tour } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Users, Mail, Phone, User, Loader2, Sparkles } from 'lucide-react';

interface BookingModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [date, setDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(1);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const totalPrice = tour.price * travelersCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/tours/${tour.id}`);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await api.post('/bookings', {
        tourId: tour.id,
        bookingDate: date,
        travelersCount,
        contactInfo: {
          fullName,
          email,
          phone,
          specialRequests,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to place booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 95, 115, 0.18)',
    color: '#0F2027',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border"
        style={{ borderColor: 'rgba(0, 95, 115, 0.15)' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4"
          style={{ background: '#FFF9F4', borderBottomColor: 'rgba(0, 95, 115, 0.12)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#0F2027' }}>Book Adventure</h3>
            <p className="text-xs line-clamp-1" style={{ color: '#4A6B74' }}>{tour.title}</p>
          </div>
          <button onClick={onClose} className="hover:opacity-75 transition cursor-pointer" style={{ color: '#789CA5' }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-amber-50 border border-amber-200 text-amber-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-8 w-8" style={{ color: '#EE9B00' }} />
            </div>
            <h4 className="text-xl font-bold" style={{ color: '#0F2027' }}>Booking Requested!</h4>
            <p className="text-sm max-w-sm" style={{ color: '#4A6B74' }}>
              Your tour registration has been submitted successfully. Redirecting you to your bookings board...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Date & Travelers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: '#4A6B74' }}>Travel Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#789CA5' }} />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: '#4A6B74' }}>Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#789CA5' }} />
                  <input
                    type="number"
                    required
                    min={1}
                    max={tour.maxGroupSize}
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Contact Info */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider block border-b pb-1"
                style={{ color: '#0F2027', borderBottomColor: 'rgba(0, 95, 115, 0.1)' }}>
                Contact Details
              </span>
              
              <div>
                <label className="text-xs font-bold block mb-1" style={{ color: '#4A6B74' }}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#789CA5' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: '#4A6B74' }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#789CA5' }} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: '#4A6B74' }}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#789CA5' }} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none transition"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1" style={{ color: '#4A6B74' }}>Special Requests (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Dietary requirements, accessibility assistance..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm resize-none focus:outline-none transition"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                />
              </div>
            </div>

            {/* Total Pricing / Submit */}
            <div className="pt-4 border-t flex items-center justify-between"
              style={{ borderTopColor: 'rgba(0, 95, 115, 0.1)' }}>
              <div>
                <span className="text-xs font-semibold block" style={{ color: '#4A6B74' }}>Total cost</span>
                <span className="text-xl font-bold" style={{ color: '#D97706' }}>KSh {totalPrice.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition hover:opacity-90 cursor-pointer disabled:opacity-50 text-sm shadow-md"
                style={{ background: '#EE9B00', color: '#FFFFFF' }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
