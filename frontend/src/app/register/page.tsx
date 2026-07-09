'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Compass, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await register(email, password, name, phone);
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#011E26',
    border: '1px solid #005F73',
    color: '#FFF9F4',
    borderRadius: '12px',
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #011E26 0%, #002F3D 100%)' }}
    >
      {/* Teal glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full pointer-events-none blur-[130px]"
        style={{ background: 'rgba(10,147,150,0.18)' }} />
      {/* Sun accent */}
      <div className="absolute bottom-[10%] left-[15%] h-[200px] w-[200px] rounded-full pointer-events-none blur-[90px]"
        style={{ background: 'rgba(238,155,0,0.1)' }} />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-6 hover:opacity-90">
            <Compass className="h-8 w-8 animate-spin-slow" style={{ color: '#0A9396' }} />
            <span style={{ color: '#FFF9F4' }}>Graphivio <span style={{ color: '#0A9396' }}>Travels</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#FFF9F4' }}>
            Start Your Adventure
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#A3C4CB' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition hover:opacity-80" style={{ color: '#EE9B00' }}>
              Sign in here
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <form
          className="mt-8 space-y-6 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
          style={{ background: 'rgba(0,47,61,0.85)', border: '1px solid #005F73' }}
          onSubmit={handleSubmit}
        >
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg p-3.5 text-sm"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }}>
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', type: 'text', value: name, onChange: setName, placeholder: 'John Doe' },
              { id: 'email', label: 'Email Address', type: 'email', value: email, onChange: setEmail, placeholder: 'you@example.com' },
              { id: 'phone', label: 'Phone Number', type: 'tel', value: phone, onChange: setPhone, placeholder: '+1 (555) 000-0000' },
              { id: 'password', label: 'Password', type: 'password', value: password, onChange: setPassword, placeholder: 'Min. 8 characters' },
            ].map(({ id, label, type, value, onChange, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-semibold mb-1.5" style={{ color: '#A3C4CB' }}>
                  {label}
                </label>
                <input
                  id={id} name={id} type={type} required
                  value={value} onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#0A9396')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#005F73')}
                />
              </div>
            ))}
          </div>

          <button
            type="submit" disabled={loading}
            className="flex w-full justify-center rounded-xl px-4 py-3 text-sm font-bold transition hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ background: '#EE9B00', color: '#011E26' }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create My Account'}
          </button>

          <p className="text-center text-xs" style={{ color: '#6B9EA8' }}>
            The first registered account automatically becomes an <span style={{ color: '#0A9396' }}>Admin</span>.
          </p>
        </form>
      </div>
    </div>
  );
}
