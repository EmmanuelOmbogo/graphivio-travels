import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ background: '#FFF9F4', borderTop: '1px solid rgba(0, 95, 115, 0.12)', color: '#4A6B74' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/graphivio-logo.png"
                alt="Graphivio Studios – Explore Your World"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Crafting premium travel experiences, customized adventures, and unforgettable journeys around the globe.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="transition hover:opacity-75" style={{ color: '#789CA5' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                onMouseLeave={e => (e.currentTarget.style.color = '#789CA5')}>
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="mailto:support@graphivio.com" className="transition hover:opacity-75" style={{ color: '#789CA5' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                onMouseLeave={e => (e.currentTarget.style.color = '#789CA5')}>
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="#" className="transition hover:opacity-75" style={{ color: '#789CA5' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                onMouseLeave={e => (e.currentTarget.style.color = '#789CA5')}>
                <Send className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#0F2027' }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/tours', label: 'All Tours' },
                { href: '/tours?difficulty=EASY', label: 'Family Friendly' },
                { href: '/tours?difficulty=DIFFICULT', label: 'Adventure & Trekking' },
                { href: '/dashboard', label: 'My Bookings' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="transition" style={{ color: '#4A6B74' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4A6B74')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#0F2027' }}>
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['Contact Us', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(label => (
                <li key={label}>
                  <Link href="#" className="transition" style={{ color: '#4A6B74' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#EE9B00')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#4A6B74')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#0F2027' }}>
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#EE9B00' }} />
                <span>123 Adventure Way, Explorer City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#EE9B00' }} />
                <span>+1 (555) TRAVEL-NOW</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#EE9B00' }} />
                <span>support@graphivio.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
          style={{ borderTop: '1px solid rgba(0,95,115,0.08)', color: '#789CA5' }}
        >
          <p>© {new Date().getFullYear()} Graphivio Travels & Tours. All rights reserved.</p>
          <p>
            Made with <span style={{ color: '#EE9B00' }}>♥</span> for unforgettable journeys.
          </p>
        </div>
      </div>
    </footer>
  );
}
