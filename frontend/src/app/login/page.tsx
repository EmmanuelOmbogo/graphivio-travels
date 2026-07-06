'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Compass, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectPath);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password. Please try again.');
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
      <div className="absolute bottom-[10%] right-[15%] h-[200px] w-[200px] rounded-full pointer-events-none blur-[90px]"
        style={{ background: 'rgba(238,155,0,0.1)' }} />

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight mb-6 hover:opacity-90">
            <Compass className="h-8 w-8 animate-spin-slow" style={{ color: '#0A9396' }} />
            <span style={{ color: '#FFF9F4' }}>Graphivio <span style={{ color: '#0A9396' }}>Travels</span></span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#FFF9F4' }}>
            Welcome Back, Explorer
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#A3C4CB' }}>
            Or{' '}
            <Link href="/register" className="font-semibold transition hover:opacity-80" style={{ color: '#EE9B00' }}>
              create a free account
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
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5" style={{ color: '#A3C4CB' }}>
                Email Address
              </label>
              <input
                id="email" name="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#0A9396')}
                onBlur={e => (e.currentTarget.style.borderColor = '#005F73')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1.5" style={{ color: '#A3C4CB' }}>
                Password
              </label>
              <input
                id="password" name="password" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#0A9396')}
                onBlur={e => (e.currentTarget.style.borderColor = '#005F73')}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="flex w-full justify-center rounded-xl px-4 py-3 text-sm font-bold transition hover:opacity-90 cursor-pointer disabled:opacity-50"
            style={{ background: '#EE9B00', color: '#011E26' }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>

          <p className="text-center text-xs" style={{ color: '#6B9EA8' }}>
            Test credentials: <span style={{ color: '#0A9396' }}>explorer@graphivio.com / customer123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
