'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tour } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Loader2, Sparkles, ChevronDown } from 'lucide-react';

interface BookingModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [country, setCountry] = useState('Kenya');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name) {
        setFirstName(user.name.split(' ')[0]);
        setLastName(user.name.split(' ').slice(1).join(' '));
      }
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [childrenAges, setChildrenAges] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [safariType, setSafariType] = useState('Bush Only');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckboxArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    value: string
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

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
        bookingDate: startDate,
        travelersCount: Number(adults) + Number(children || 0),
        contactInfo: {
          firstName,
          lastName,
          country,
          phone,
          email,
          duration,
          endDate,
          adults,
          children,
          childrenAges,
          budget,
          currency,
          safariType,
          description
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
    background: '#F4F5F7',
    border: '1px solid #E5E7EB',
    color: '#374151',
  };

  const labelStyle = {
    color: '#111827',
    fontWeight: 700,
    fontSize: '13px',
    marginBottom: '6px',
    display: 'block'
  };

  const asteriskStyle = { color: '#DC2626' };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
        
        {/* Header */}
        <div className="absolute right-0 top-0 p-4">
          <button onClick={onClose} className="hover:opacity-75 transition cursor-pointer text-gray-500 bg-white shadow-sm border rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 bg-green-50 border border-green-200 text-green-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="h-10 w-10" style={{ color: '#10B981' }} />
            </div>
            <h4 className="text-2xl font-bold" style={{ color: '#0F2027' }}>Booking Requested!</h4>
            <p className="text-gray-600 max-w-sm">
              Your tour registration has been submitted successfully. Redirecting you to your bookings board...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* First Name */}
              <div>
                <label style={labelStyle}>First Name <span style={asteriskStyle}>*</span></label>
                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Last Name */}
              <div>
                <label style={labelStyle}>Last Name <span style={asteriskStyle}>*</span></label>
                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Country */}
              <div>
                <label style={labelStyle}>Country <span style={asteriskStyle}>*</span></label>
                <div className="relative">
                  <select required value={country} onChange={e => setCountry(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition appearance-none" style={inputStyle}>
                    <option value="Kenya">Kenya</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label style={labelStyle}>Phone Number <span style={asteriskStyle}>*</span></label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="0791631985"
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Email Address */}
              <div>
                <label style={labelStyle}>Email Address <span style={asteriskStyle}>*</span></label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Duration of Tour */}
              <div>
                <label style={labelStyle}>Duration of Tour <span style={asteriskStyle}>*</span></label>
                <input type="number" required min="1" value={duration} onChange={e => setDuration(e.target.value)} placeholder="4"
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Safari Start Date */}
              <div>
                <label style={labelStyle}>Safari Start Date <span style={asteriskStyle}>*</span></label>
                <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Safari End Date */}
              <div>
                <label style={labelStyle}>Safari End Date <span style={asteriskStyle}>*</span></label>
                <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Number of Adults */}
              <div>
                <label style={labelStyle}>Number of Adults <span style={asteriskStyle}>*</span></label>
                <input type="number" required min="1" value={adults} onChange={e => setAdults(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Number of Children */}
              <div>
                <label style={labelStyle}>Number of Children <span style={asteriskStyle}>*</span></label>
                <input type="number" required min="0" value={children} onChange={e => setChildren(e.target.value)} placeholder="enter 0 if none"
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Age of Children */}
              <div>
                <label style={labelStyle}>Age of Children</label>
                <div className="space-y-1.5 mt-2">
                  {['0 - 3 yrs', '4 - 12 yrs', '13 - 18 yrs'].map(age => (
                    <label key={age} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" checked={childrenAges.includes(age)} onChange={() => handleCheckboxArrayChange(setChildrenAges, childrenAges, age)}
                        className="rounded border-gray-300 text-gray-800 focus:ring-gray-800" />
                      <span>{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estimated Budget of Tour (Per Person) */}
              <div>
                <label style={labelStyle}>Estimated Budget of Tour (Per Person) <span style={asteriskStyle}>*</span></label>
                <input type="text" required value={budget} onChange={e => setBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition" style={inputStyle} />
              </div>

              {/* Currency */}
              <div>
                <label style={labelStyle}>Currency <span style={asteriskStyle}>*</span></label>
                <div className="relative">
                  <select required value={currency} onChange={e => setCurrency(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition appearance-none" style={inputStyle}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="KES">KES</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Type of Safari */}
              <div>
                <label style={labelStyle}>Type of Safari <span style={asteriskStyle}>*</span></label>
                <div className="space-y-1.5 mt-2">
                  {['Bush Only', 'Bush & Beach combined', 'Beach Only'].map(type => (
                    <label key={type} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input type="radio" name="safariType" required value={type} checked={safariType === type} onChange={e => setSafariType(e.target.value)}
                        className="border-gray-300 text-gray-800 focus:ring-gray-800" />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Any other Tour Description */}
            <div className="mt-8">
              <label style={labelStyle}>Any other Tour Description <span style={asteriskStyle}>*</span></label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Please share any special dietary, physical, or other important details for us to meet your needs during the tour."
                rows={4}
                className="w-full px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-400 transition resize-none" style={inputStyle} />
            </div>

            <div className="pt-6">
              <p className="text-xs text-gray-500 mb-4">Your data will be processed according to our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#333333] hover:bg-black text-white font-bold py-2 px-6 rounded text-sm uppercase tracking-wider transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                SUBMIT
              </button>
            </div>

          </form>
        )}
      </div>
      </div>
    </div>
  );
}

