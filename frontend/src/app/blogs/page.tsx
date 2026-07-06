'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BlogPost } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookOpen, Calendar, User, ArrowRight, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { value: '', label: 'All Articles' },
    { value: 'Travel tips', label: 'Travel Tips' },
    { value: 'Visa guides', label: 'Visa Guides' },
    { value: 'Packing lists', label: 'Packing Lists' },
    { value: 'Best destinations', label: 'Best Destinations' },
    { value: 'Travel news', label: 'Travel News' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Budget travel', label: 'Budget Travel' },
  ];

  // Fetch blogs from API
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blogs', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      const res = await api.get(`/blogs?${params.toString()}`);
      return res.data;
    },
  });

  // Filter posts on the frontend by search query
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const recentPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: 'rgba(238,155,0,0.1)', color: '#EE9B00' }}
          >
            <BookOpen className="h-3 w-3" />
            Graphivio Chronicles
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
            Travel Tips, Stories & Guides
          </h1>
          <p className="text-base" style={{ color: '#4A6B74' }}>
            Get expert insights, packing lists, visa updates, and inspiration for your next dream trip to Kenya, Seychelles, and beyond.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{ background: '#FFF9F4', border: '1px solid rgba(0, 95, 115, 0.15)', color: '#0F2027' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#EE9B00')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.15)')}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#EE9B00' }} />
            </div>

            {/* Category Pills list */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border"
                  style={{
                    background: selectedCategory === cat.value ? '#005F73' : '#FFF9F4',
                    color: selectedCategory === cat.value ? '#FFFFFF' : '#4A6B74',
                    borderColor: selectedCategory === cat.value ? '#005F73' : 'rgba(0, 95, 115, 0.12)',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#EE9B00' }} />
            <span className="text-sm font-semibold" style={{ color: '#4A6B74' }}>Opening our ledger...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center border border-dashed p-16 rounded-2xl text-center max-w-lg mx-auto"
            style={{ borderColor: 'rgba(0, 95, 115, 0.18)' }}
          >
            <BookOpen className="h-12 w-12 mb-4" style={{ color: '#EE9B00' }} />
            <h3 className="text-lg font-bold" style={{ color: '#0F2027' }}>No articles found</h3>
            <p className="text-sm mt-1" style={{ color: '#789CA5' }}>
              We couldn't find any articles matching "{searchQuery}" under this category. Try adjusting your query.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post (Only show if search is not active or we have results) */}
            {featuredPost && !searchQuery && (
              <div
                className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border"
                style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.15)' }}
              >
                <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px]">
                  <img
                    src={featuredPost.imageCover}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: '#EE9B00', color: '#FFFFFF' }}
                  >
                    Featured • {featuredPost.category}
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: '#789CA5' }}>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" style={{ color: '#EE9B00' }} />
                        {new Date(featuredPost.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" style={{ color: '#EE9B00' }} />
                        {featuredPost.author?.name || 'Admin'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight" style={{ color: '#0F2027' }}>
                      {featuredPost.title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: '#4A6B74' }}>
                      {featuredPost.summary}
                    </p>
                  </div>

                  <Link
                    href={`/blogs/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition hover:gap-2.5 self-start"
                    style={{ color: '#005F73' }}
                  >
                    Read Full Article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Recent Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl overflow-hidden border flex flex-col hover:shadow-md transition"
                  style={{ background: '#FFFFFF', borderColor: 'rgba(0, 95, 115, 0.12)' }}
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100">
                    <img
                      src={post.imageCover}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: 'rgba(0, 95, 115, 0.9)', color: '#FFFFFF' }}
                    >
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase" style={{ color: '#789CA5' }}>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" style={{ color: '#EE9B00' }} />
                          {new Date(post.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short' })}
                        </span>
                        <span>•</span>
                        <span>{post.author?.name || 'Admin'}</span>
                      </div>

                      <h3 className="text-lg font-bold leading-snug line-clamp-2 hover:opacity-85 transition-opacity" style={{ color: '#0F2027' }}>
                        <Link href={`/blogs/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#4A6B74' }}>
                        {post.summary}
                      </p>
                    </div>

                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold transition hover:gap-1.5 self-start"
                      style={{ color: '#EE9B00' }}
                    >
                      Read Article
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
