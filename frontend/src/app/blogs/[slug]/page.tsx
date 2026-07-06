'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BlogPost } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, User, ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = React.use(params);

  // Fetch blog detail
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  // Fetch latest blogs for suggested reading section
  const { data: recentPosts } = useQuery<BlogPost[]>({
    queryKey: ['latestBlogsSuggest'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data;
    },
  });

  const suggestions = recentPosts?.filter((p) => p.slug !== slug).slice(0, 3) || [];

  if (isLoading && !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#EE9B00' }} />
        <span className="font-semibold text-sm animate-pulse" style={{ color: '#4A6B74' }}>Retrieving archive chronicle...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <BookOpen className="h-12 w-12 animate-pulse" style={{ color: '#EE9B00' }} />
        <span className="text-xl font-bold" style={{ color: '#0F2027' }}>Article Not Found</span>
        <Link href="/blogs" className="font-bold hover:underline flex items-center gap-1" style={{ color: '#EE9B00' }}>
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-bold mb-8 hover:underline transition"
          style={{ color: '#EE9B00' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Chronicles
        </Link>

        {/* Article Header */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: 'rgba(0, 95, 115, 0.08)', color: '#005F73' }}
            >
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight" style={{ color: '#0F2027' }}>
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold border-y py-4"
            style={{ color: '#4A6B74', borderColor: 'rgba(0, 95, 115, 0.08)' }}>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" style={{ color: '#EE9B00' }} />
              <span>Written by <span className="font-bold" style={{ color: '#0F2027' }}>{post.author?.name || 'Admin'}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" style={{ color: '#EE9B00' }} />
              <span>{new Date(post.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Feature Cover Image */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-sm border"
          style={{ borderColor: 'rgba(0, 95, 115, 0.12)' }}>
          <img
            src={post.imageCover}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="prose max-w-none mb-16 space-y-6">
          <p className="text-base font-medium leading-relaxed italic border-l-4 pl-4"
            style={{ color: '#4A6B74', borderColor: '#EE9B00' }}>
            {post.summary}
          </p>

          <div className="text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line" style={{ color: '#2B4046' }}>
            {post.content}
          </div>
        </article>

        {/* Suggestions / Related Reading */}
        {suggestions.length > 0 && (
          <section className="pt-10 border-t" style={{ borderColor: 'rgba(0, 95, 115, 0.12)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#0F2027' }}>Keep Exploring Chronicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/blogs/${item.slug}`}
                  className="group block space-y-3 rounded-2xl p-4 transition border hover:shadow-sm"
                  style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.08)' }}
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.imageCover}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: '#789CA5' }}>
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug group-hover:underline" style={{ color: '#0F2027' }}>
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
