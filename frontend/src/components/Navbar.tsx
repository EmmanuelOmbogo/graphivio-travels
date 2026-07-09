'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  User, LogOut, Shield, Search, ChevronDown, Headphones,
  Sparkles, Palmtree, Plane, Activity, MapPin, Car, Info, Menu, X
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/tours');
    }
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* ===== TOP ROW ===== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Brand Icon Mark */}
              <div className="flex items-center justify-center h-11 w-11 rounded-xl shadow-lg flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #F97316 0%, #0F2027 100%)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" opacity="0.9"/>
                  <circle cx="12" cy="9" r="2.5" fill="#F97316"/>
                  <path d="M3 20h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>

              {/* Brand Name */}
              <div className="flex flex-col leading-none">
                <span className="text-[22px] font-black tracking-tight leading-none"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #0F2027 60%, #F97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  Graphivio
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] mt-0.5"
                  style={{ color: '#F97316' }}>
                  Travels &amp; Tours
                </span>
              </div>
            </Link>
          </div>

          {/* Action Buttons & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/tours"
              className="bg-[#F97316] text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
            >
              All Packages
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 transition-colors"
                  >
                    <Shield className="h-3 w-3" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[#F97316] transition-colors"
                >
                  <User className="h-4 w-4 text-orange-500" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-500 hover:text-orange-500 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-[#F97316] focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ===== BOTTOM ROW (NAVIGATION & CALL CENTER) ===== */}
      <div className="hidden md:block bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            {/* Nav Menu Items */}
            <nav className="flex items-center gap-6 text-xs font-bold text-gray-700 select-none">
              {/* Quick Links */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('quick')}
                  className="flex items-center gap-1 py-1 hover:text-[#F97316] cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5 text-orange-500" />
                  <span>Quick Links</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 space-y-1">
                  <Link href="/blogs" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">Our Travel Blog</Link>
                  <Link href="/tours" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">All Expeditions</Link>
                  <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">My Bookings</Link>
                  <Link href="/login" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">Sign In / Register</Link>
                </div>
              </div>

              {/* Vacations */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('vacations')}
                  className="flex items-center gap-1 py-1 hover:text-[#F97316] cursor-pointer"
                >
                  <Palmtree className="h-3.5 w-3.5 text-orange-500" />
                  <span>Vacations</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 space-y-1">
                  <Link href="/tours?category=beach" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🏖️ Coastal Beach Escapes</Link>
                  <Link href="/tours?category=safari" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🦁 Premium Wild Safaris</Link>
                  <Link href="/tours?category=honeymoon" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">💑 Romantic Getaways</Link>
                </div>
              </div>

              {/* Holiday Offers */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('offers')}
                  className="flex items-center gap-1 py-1 hover:text-[#F97316] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span>Holiday Offers</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute left-0 mt-2 w-52 rounded-xl bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 space-y-1">
                  <Link href="/tours?search=Maasai Mara" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🌅 Maasai Mara Special</Link>
                  <Link href="/tours?search=Diani" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🌴 Diani Family Packages</Link>
                  <Link href="/tours?search=Seychelles" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🏝️ Seychelles UNESCO Tour</Link>
                </div>
              </div>

              {/* All Tours */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('tours')}
                  className="flex items-center gap-1 py-1 hover:text-[#F97316] cursor-pointer"
                >
                  <Plane className="h-3.5 w-3.5 text-orange-500" />
                  <span>All Tours</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 space-y-1">
                  <Link href="/tours?difficulty=EASY" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">✅ Easy Sightseeing</Link>
                  <Link href="/tours?difficulty=MEDIUM" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🥾 Medium Treks</Link>
                  <Link href="/tours?difficulty=DIFFICULT" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🏔️ Challenging Climbs</Link>
                </div>
              </div>

              {/* Activities */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('activities')}
                  className="flex items-center gap-1 py-1 hover:text-[#F97316] cursor-pointer"
                >
                  <Activity className="h-3.5 w-3.5 text-orange-500" />
                  <span>Activities</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 space-y-1">
                  <Link href="/tours?category=safari" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🦁 Wildlife Game Drives</Link>
                  <Link href="/tours?category=balloon" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🎈 Hot Air Balloons</Link>
                  <Link href="/tours?category=expedition" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-[#F97316]">🌿 Rainforest Hikes</Link>
                </div>
              </div>

              {/* All Destinations */}
              <Link href="/tours" className="flex items-center gap-1 hover:text-[#F97316]">
                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                <span>All Destinations</span>
              </Link>

            </nav>

            {/* Support Call Details */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 border border-orange-100">
                <Headphones className="h-4 w-4 text-[#F97316] animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold leading-none">Call Us | 24/7</span>
                <span className="text-xs font-black text-gray-900 leading-tight">+254 799 030 781</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-inner">
          {/* Mobile Search */}
          <form onSubmit={handleHeaderSearch} className="flex bg-slate-100 rounded-full overflow-hidden p-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages..."
              className="w-full bg-transparent px-4 py-2 text-xs focus:outline-none text-gray-800"
            />
            <button type="submit" className="bg-[#F97316] text-white p-2 rounded-full">
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col gap-3.5 text-sm font-bold text-gray-700 pl-2">
            <Link href="/tours" onClick={() => setMobileMenuOpen(false)}>All Packages</Link>
            <Link href="/blogs" onClick={() => setMobileMenuOpen(false)}>Travel Blog</Link>
            <Link href="/tours?search=Safari" onClick={() => setMobileMenuOpen(false)}>Wildlife Safaris</Link>
            <Link href="/tours?search=Beach" onClick={() => setMobileMenuOpen(false)}>Beach Vacations</Link>
            <Link href="/tours" onClick={() => setMobileMenuOpen(false)}>All Destinations</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-left font-bold text-red-500 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center gap-2">
            <Headphones className="h-5 w-5 text-[#F97316]" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase text-gray-400 font-extrabold leading-none">Call Us | 24/7</span>
              <span className="text-xs font-black text-gray-900 leading-tight">+254 799 030 781</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
