'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Shield } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md shadow-sm"
      style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'rgba(0,95,115,0.15)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/graphivio-logo.png"
                alt="Graphivio Studios – Explore Your World"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/tours"
              className="text-sm font-semibold transition hover:opacity-80"
              style={{ color: '#4A6B74' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A6B74')}>
              Explore Tours
            </Link>

            <Link href="/blogs"
              className="text-sm font-semibold transition hover:opacity-80"
              style={{ color: '#4A6B74' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A6B74')}>
              Blog
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition hover:opacity-80"
                    style={{ color: '#EE9B00', backgroundColor: 'rgba(238,155,0,0.1)', borderColor: 'rgba(238,155,0,0.25)' }}
                  >
                    <Shield className="h-3 w-3" />
                    Admin Panel
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-semibold transition hover:opacity-80"
                  style={{ color: '#4A6B74' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#4A6B74')}
                >
                  <User className="h-4 w-4" style={{ color: '#EE9B00' }} />
                  <span>My Bookings</span>
                </Link>

                <div className="h-4 w-px opacity-30" style={{ background: '#005F73' }} />

                <span className="text-sm" style={{ color: '#4A6B74' }}>
                  Hi, <span className="font-semibold" style={{ color: '#0F2027' }}>{user.name}</span>
                </span>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-semibold transition hover:text-red-500 cursor-pointer"
                  style={{ color: '#789CA5' }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login"
                  className="text-sm font-semibold transition"
                  style={{ color: '#4A6B74' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#4A6B74')}>
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold shadow-sm transition hover:opacity-90"
                  style={{ background: '#EE9B00', color: '#FFFFFF' }}
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
