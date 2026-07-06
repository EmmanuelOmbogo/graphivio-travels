'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Tour, Booking, BlogPost } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Plus, Calendar, Users, DollarSign, Loader2, Edit, Trash2,
  CheckCircle2, XCircle, Shield, BarChart3, Settings, ChevronDown, BookOpen
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'tours' | 'bookings' | 'blogs'>('tours');

  // Form state for creating a new tour
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newGroupSize, setNewGroupSize] = useState('10');
  const [newDifficulty, setNewDifficulty] = useState<'EASY' | 'MEDIUM' | 'DIFFICULT'>('MEDIUM');

  // Form state for creating a blog post
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Travel tips');
  const [blogImageCover, setBlogImageCover] = useState('');
  const [blogPublished, setBlogPublished] = useState(true);

  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Price editing state
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [priceError, setPriceError] = useState('');

  // Redirect if not ADMIN
  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  // Fetch admin tours
  const { data: tours, isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ['adminTours'],
    queryFn: async () => {
      const res = await api.get('/tours');
      return res.data;
    },
    enabled: user?.role === 'ADMIN',
  });

  // Fetch admin bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const res = await api.get('/bookings');
      return res.data;
    },
    enabled: user?.role === 'ADMIN',
  });

  // Create tour mutation
  const createTourMutation = useMutation({
    mutationFn: async (tourData: Partial<Tour>) => {
      await api.post('/tours', tourData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      setShowAddForm(false);
      resetForm();
    },
  });

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'PAID' | 'CANCELLED' | 'PENDING' }) => {
      await api.patch(`/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      setUpdatingStatusId(null);
    },
    onError: () => {
      setUpdatingStatusId(null);
    },
  });

  const handleStatusChange = async (id: string, status: 'PAID' | 'CANCELLED' | 'PENDING') => {
    setUpdatingStatusId(id);
    updateBookingMutation.mutate({ id, status });
  };

  // Delete tour mutation
  const deleteTourMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tours/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      queryClient.invalidateQueries({ queryKey: ['featuredTours'] });
    },
  });

  // Update tour price mutation
  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      await api.patch(`/tours/${id}`, { price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      queryClient.invalidateQueries({ queryKey: ['featuredTours'] });
      setEditingTourId(null);
      setEditingPrice('');
      setPriceError('');
    },
    onError: (err: any) => {
      setPriceError(err.response?.data?.message || 'Failed to update price.');
    },
  });

  const startEditPrice = (tour: Tour) => {
    setEditingTourId(tour.id);
    setEditingPrice(String(tour.price));
    setPriceError('');
  };

  const cancelEditPrice = () => {
    setEditingTourId(null);
    setEditingPrice('');
    setPriceError('');
  };

  const handleSavePrice = (id: string) => {
    const parsed = Number(editingPrice);
    if (!editingPrice || isNaN(parsed) || parsed <= 0) {
      setPriceError('Enter a valid price > 0');
      return;
    }
    updatePriceMutation.mutate({ id, price: parsed });
  };

  // Fetch blog posts
  const { data: blogs } = useQuery<BlogPost[]>({
    queryKey: ['adminBlogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Create blog post mutation
  const createBlogMutation = useMutation({
    mutationFn: async (newBlog: any) => {
      await api.post('/blogs', newBlog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      setShowAddBlogForm(false);
      setBlogTitle('');
      setBlogSummary('');
      setBlogContent('');
      setBlogImageCover('');
      setBlogPublished(true);
      setActionLoading(false);
    },
    onError: (err: any) => {
      setActionError(err.response?.data?.message || 'Failed to create blog post.');
      setActionLoading(false);
    }
  });

  // Delete blog post mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
  });

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionLoading(true);

    if (!blogTitle.trim() || !blogSummary.trim() || !blogContent.trim()) {
      setActionError('Title, summary, and content are required.');
      setActionLoading(false);
      return;
    }

    createBlogMutation.mutate({
      title: blogTitle,
      summary: blogSummary,
      content: blogContent,
      category: blogCategory,
      imageCover: blogImageCover || undefined,
      published: blogPublished,
    });
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewPrice('');
    setNewDuration('');
    setNewLocation('');
    setNewCover('');
    setNewGroupSize('10');
    setNewDifficulty('MEDIUM');
    setActionError('');
  };

  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionLoading(true);

    try {
      const tourData = {
        title: newTitle,
        description: newDescription,
        price: Number(newPrice),
        durationDays: Number(newDuration),
        location: newLocation,
        imageCover: newCover || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
        maxGroupSize: Number(newGroupSize),
        difficulty: newDifficulty,
      };

      await createTourMutation.mutateAsync(tourData);
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to publish new tour.');
    } finally {
      setActionLoading(false);
    }
  };

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

  if (authLoading || toursLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: '#EE9B00' }} />
        <span className="font-semibold text-sm animate-pulse" style={{ color: '#4A6B74' }}>Verifying admin authorization...</span>
      </div>
    );
  }

  // Calculate statistics
  const totalBookingsCount = bookings?.length || 0;
  const totalEarnings = bookings?.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.price, 0) || 0;
  const totalToursCount = tours?.length || 0;

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 95, 115, 0.18)',
    color: '#0F2027',
    borderRadius: '12px',
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <div className="space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0F2027' }}>
                Admin Operations Panel
              </h1>
              <p className="text-sm mt-1" style={{ color: '#4A6B74' }}>
                Manage tour packages, edit catalogs, and approve traveler reservation bookings.
              </p>
            </div>

            {activeTab === 'tours' && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition hover:opacity-90 cursor-pointer"
                style={{ background: '#EE9B00', color: '#FFFFFF' }}
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Add New Tour</span>
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl flex items-center gap-4 border"
              style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.15)' }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(238, 155, 0, 0.08)', border: '1px solid rgba(238, 155, 0, 0.2)' }}>
                <DollarSign className="h-6 w-6" style={{ color: '#EE9B00' }} />
              </div>
              <div>
                <span className="text-xs uppercase block font-semibold" style={{ color: '#789CA5' }}>Admin Revenue</span>
                <span className="text-2xl font-black" style={{ color: '#0F2027' }}>KSh {totalEarnings.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl flex items-center gap-4 border"
              style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.15)' }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(238, 155, 0, 0.08)', border: '1px solid rgba(238, 155, 0, 0.2)' }}>
                <Users className="h-6 w-6" style={{ color: '#EE9B00' }} />
              </div>
              <div>
                <span className="text-xs uppercase block font-semibold" style={{ color: '#789CA5' }}>Total Bookings</span>
                <span className="text-2xl font-black" style={{ color: '#0F2027' }}>{totalBookingsCount}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl flex items-center gap-4 border"
              style={{ background: '#FFF9F4', borderColor: 'rgba(0, 95, 115, 0.15)' }}>
              <div className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(238, 155, 0, 0.08)', border: '1px solid rgba(238, 155, 0, 0.2)' }}>
                <Settings className="h-6 w-6" style={{ color: '#EE9B00' }} />
              </div>
              <div>
                <span className="text-xs uppercase block font-semibold" style={{ color: '#789CA5' }}>Active Tours</span>
                <span className="text-2xl font-black" style={{ color: '#0F2027' }}>{totalToursCount}</span>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-6 border-b" style={{ borderBottomColor: 'rgba(0, 95, 115, 0.15)' }}>
            <button
              onClick={() => {
                setActiveTab('tours');
                setShowAddForm(false);
                setShowAddBlogForm(false);
              }}
              className="pb-4 text-sm font-bold border-b-2 px-1 cursor-pointer transition"
              style={{
                borderBottomColor: activeTab === 'tours' ? '#EE9B00' : 'transparent',
                color: activeTab === 'tours' ? '#EE9B00' : '#4A6B74',
              }}
            >
              Expedition Catalogues
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setShowAddForm(false);
                setShowAddBlogForm(false);
              }}
              className="pb-4 text-sm font-bold border-b-2 px-1 cursor-pointer transition"
              style={{
                borderBottomColor: activeTab === 'bookings' ? '#EE9B00' : 'transparent',
                color: activeTab === 'bookings' ? '#EE9B00' : '#4A6B74',
              }}
            >
              Booking Orders
            </button>
            <button
              onClick={() => {
                setActiveTab('blogs');
                setShowAddForm(false);
                setShowAddBlogForm(false);
              }}
              className="pb-4 text-sm font-bold border-b-2 px-1 cursor-pointer transition"
              style={{
                borderBottomColor: activeTab === 'blogs' ? '#EE9B00' : 'transparent',
                color: activeTab === 'blogs' ? '#EE9B00' : '#4A6B74',
              }}
            >
              Blog Posts
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'tours' ? (
            <div className="space-y-6">
              {showAddForm ? (
                <form onSubmit={handleAddTour} className="p-6 rounded-2xl space-y-4 max-w-2xl border bg-white"
                  style={{ borderColor: 'rgba(0, 95, 115, 0.15)', background: '#FFF9F4' }}>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#0F2027' }}>Publish New Expedition</h3>

                  {actionError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                      {actionError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Title</label>
                      <input
                        type="text" required
                        value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Serengeti Luxury Wildlife Safari"
                        className="w-full px-3 py-2 text-xs focus:outline-none transition"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Location</label>
                      <input
                        type="text" required
                        value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="e.g. Tanzania"
                        className="w-full px-3 py-2 text-xs focus:outline-none transition"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Description</label>
                    <textarea
                      required
                      value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Write description detailing highlights, inclusions..."
                      rows={3}
                      className="w-full px-3 py-2 text-xs resize-none focus:outline-none transition bg-white"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Price (KSh)</label>
                      <input
                        type="number" required
                        value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="500"
                        className="w-full px-3 py-2 text-xs focus:outline-none transition"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Duration (Days)</label>
                      <input
                        type="number" required
                        value={newDuration} onChange={(e) => setNewDuration(e.target.value)}
                        placeholder="3"
                        className="w-full px-3 py-2 text-xs focus:outline-none transition"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Max Group Size</label>
                      <input
                        type="number" required
                        value={newGroupSize} onChange={(e) => setNewGroupSize(e.target.value)}
                        className="w-full px-3 py-2 text-xs focus:outline-none transition"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Difficulty</label>
                      <select
                        value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs focus:outline-none transition cursor-pointer bg-white"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="DIFFICULT">Difficult</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: '#4A6B74' }}>Cover Image Link (URL)</label>
                    <input
                      type="url"
                      value={newCover} onChange={(e) => setNewCover(e.target.value)}
                      placeholder="https://example.com/cover.jpg"
                      className="w-full px-3 py-2 text-xs focus:outline-none transition"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = '#EE9B00')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0, 95, 115, 0.18)')}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit" disabled={actionLoading}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-md"
                      style={{ background: '#EE9B00', color: '#FFFFFF' }}
                    >
                      {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Publish Tour'}
                    </button>
                    <button
                      type="button" onClick={() => setShowAddForm(false)}
                      className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
                      style={{ background: '#005F73', color: '#FFFFFF' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : tours && tours.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgba(0, 95, 115, 0.15)', background: '#FFFFFF' }}>
                  <table className="w-full text-left border-collapse text-xs sm:text-sm" style={{ color: '#4A6B74' }}>
                    <thead className="border-b font-bold uppercase text-[10px]"
                      style={{ background: '#FFF9F4', borderBottomColor: 'rgba(0, 95, 115, 0.12)', color: '#0F2027' }}>
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Fare</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4 text-right">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(0,95,115,0.08)]">
                      {tours.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold" style={{ color: '#0F2027' }}>{t.title}</td>
                          <td className="px-6 py-4">{t.location}</td>

                          {/* Price cell — normal or edit mode */}
                          <td className="px-6 py-4">
                            {editingTourId === t.id ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold shrink-0" style={{ color: '#4A6B74' }}>KSh</span>
                                  <input
                                    id={`price-input-${t.id}`}
                                    type="number"
                                    min="1"
                                    value={editingPrice}
                                    onChange={(e) => { setEditingPrice(e.target.value); setPriceError(''); }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSavePrice(t.id);
                                      if (e.key === 'Escape') cancelEditPrice();
                                    }}
                                    autoFocus
                                    className="w-28 px-2 py-1 text-xs rounded-lg border focus:outline-none"
                                    style={{ border: '1px solid #EE9B00', color: '#0F2027' }}
                                  />
                                  <button
                                    onClick={() => handleSavePrice(t.id)}
                                    disabled={updatePriceMutation.isPending}
                                    className="px-2 py-1 text-[10px] font-bold rounded-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                                    style={{ background: '#005F73', color: '#FFFFFF' }}
                                  >
                                    {updatePriceMutation.isPending && editingTourId === t.id
                                      ? <Loader2 className="h-3 w-3 animate-spin" />
                                      : 'Save'}
                                  </button>
                                  <button
                                    onClick={cancelEditPrice}
                                    className="px-2 py-1 text-[10px] font-bold rounded-lg transition hover:opacity-90 cursor-pointer"
                                    style={{ background: 'rgba(0,95,115,0.08)', color: '#4A6B74' }}
                                  >
                                    ✕
                                  </button>
                                </div>
                                {priceError && (
                                  <span className="text-[10px] text-red-500">{priceError}</span>
                                )}
                              </div>
                            ) : (
                              <span className="font-bold" style={{ color: '#D97706' }}>KSh {t.price.toLocaleString()}</span>
                            )}
                          </td>

                          <td className="px-6 py-4">{t.durationDays} Days</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 bg-slate-50">
                              {t.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              {/* Edit price button */}
                              <button
                                id={`edit-price-${t.id}`}
                                onClick={() => editingTourId === t.id ? cancelEditPrice() : startEditPrice(t)}
                                title="Edit price"
                                className="transition cursor-pointer hover:opacity-70"
                                style={{ color: editingTourId === t.id ? '#789CA5' : '#005F73' }}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {/* Delete button */}
                              <button
                                id={`delete-tour-${t.id}`}
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${t.title}"?`)) {
                                    deleteTourMutation.mutate(t.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 transition cursor-pointer"
                                title="Delete tour"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs" style={{ color: '#789CA5' }}>No expeditions found in catalog database.</p>
              )}
            </div>
          ) : activeTab === 'bookings' ? (
            <div className="space-y-6">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#EE9B00' }} />
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgba(0, 95, 115, 0.15)', background: '#FFFFFF' }}>
                  <table className="w-full text-left border-collapse text-xs sm:text-sm" style={{ color: '#4A6B74' }}>
                    <thead className="border-b font-bold uppercase text-[10px]"
                      style={{ background: '#FFF9F4', borderBottomColor: 'rgba(0, 95, 115, 0.12)', color: '#0F2027' }}>
                      <tr>
                        <th className="px-6 py-4">Expedition</th>
                        <th className="px-6 py-4">Traveler Details</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">People</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(0,95,115,0.08)]">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold" style={{ color: '#0F2027' }}>{b.tour?.title || 'Unknown Tour'}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-xs">
                              <span className="font-bold text-slate-800">{b.contactInfo?.fullName}</span>
                              <span style={{ color: '#789CA5' }}>{b.contactInfo?.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{new Date(b.bookingDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{b.travelersCount}</td>
                          <td className="px-6 py-4 font-bold" style={{ color: '#D97706' }}>KSh {b.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(b.status)}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {updatingStatusId === b.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#EE9B00' }} />
                              ) : (
                                <div className="relative">
                                  <select
                                    id={`status-select-${b.id}`}
                                    value={b.status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        b.id,
                                        e.target.value as 'PAID' | 'CANCELLED' | 'PENDING'
                                      )
                                    }
                                    className="appearance-none text-[10px] font-bold pl-2.5 pr-6 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition"
                                    style={{
                                      background:
                                        b.status === 'PAID'
                                          ? 'rgba(34,197,94,0.08)'
                                          : b.status === 'CANCELLED'
                                          ? 'rgba(239,68,68,0.08)'
                                          : 'rgba(234,179,8,0.08)',
                                      color:
                                        b.status === 'PAID'
                                          ? '#16a34a'
                                          : b.status === 'CANCELLED'
                                          ? '#dc2626'
                                          : '#b45309',
                                      borderColor:
                                        b.status === 'PAID'
                                          ? 'rgba(34,197,94,0.3)'
                                          : b.status === 'CANCELLED'
                                          ? 'rgba(239,68,68,0.3)'
                                          : 'rgba(234,179,8,0.3)',
                                    }}
                                  >
                                    <option value="PENDING">⏳ PENDING</option>
                                    <option value="PAID">✅ PAID</option>
                                    <option value="CANCELLED">❌ CANCELLED</option>
                                  </select>
                                  <ChevronDown
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none"
                                    style={{
                                      color:
                                        b.status === 'PAID'
                                          ? '#16a34a'
                                          : b.status === 'CANCELLED'
                                          ? '#dc2626'
                                          : '#b45309',
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs" style={{ color: '#789CA5' }}>No booking orders registered yet.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold" style={{ color: '#0F2027' }}>Blog Posts Directory</h2>
                {!showAddBlogForm && (
                  <button
                    onClick={() => setShowAddBlogForm(true)}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90 shadow-sm cursor-pointer"
                    style={{ background: '#EE9B00', color: '#FFFFFF' }}
                  >
                    <Plus className="h-4 w-4" />
                    Write Blog Post
                  </button>
                )}
              </div>

              {showAddBlogForm ? (
                <form onSubmit={handleAddBlog} className="p-6 rounded-2xl space-y-4 max-w-2xl border bg-white"
                  style={{ borderColor: 'rgba(0, 95, 115, 0.15)', background: '#FFF9F4' }}>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#0F2027' }}>Compose New Article</h3>

                  {actionError && (
                    <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 p-2.5 rounded-lg">
                      ⚠️ {actionError}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A6B74' }}>Article Title</label>
                      <input
                        type="text" required
                        value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="e.g. 10 Packing Secrets for Seychelles"
                        className="w-full px-3 py-2 text-sm rounded-xl border focus:outline-none"
                        style={{ border: '1px solid rgba(0, 95, 115, 0.18)', color: '#0F2027' }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A6B74' }}>Category</label>
                        <select
                          value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-xl border focus:outline-none bg-white cursor-pointer"
                          style={{ border: '1px solid rgba(0, 95, 115, 0.18)', color: '#0F2027' }}
                        >
                          <option value="Travel tips">Travel tips</option>
                          <option value="Visa guides">Visa guides</option>
                          <option value="Packing lists">Packing lists</option>
                          <option value="Best destinations">Best destinations</option>
                          <option value="Travel news">Travel news</option>
                          <option value="Photography">Photography</option>
                          <option value="Budget travel">Budget travel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A6B74' }}>Cover Image URL (Unsplash)</label>
                        <input
                          type="url"
                          value={blogImageCover} onChange={(e) => setBlogImageCover(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 text-sm rounded-xl border focus:outline-none"
                          style={{ border: '1px solid rgba(0, 95, 115, 0.18)', color: '#0F2027' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A6B74' }}>Short Summary</label>
                      <input
                        type="text" required
                        value={blogSummary} onChange={(e) => setBlogSummary(e.target.value)}
                        placeholder="A brief 1-2 sentence overview for the cards..."
                        className="w-full px-3 py-2 text-sm rounded-xl border focus:outline-none"
                        style={{ border: '1px solid rgba(0, 95, 115, 0.18)', color: '#0F2027' }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: '#4A6B74' }}>Article Content</label>
                      <textarea
                        required rows={8}
                        value={blogContent} onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="Write your article details here..."
                        className="w-full px-3 py-2 text-sm rounded-xl border focus:outline-none"
                        style={{ border: '1px solid rgba(0, 95, 115, 0.18)', color: '#0F2027' }}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="blogPublished"
                        checked={blogPublished}
                        onChange={(e) => setBlogPublished(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="blogPublished" className="text-xs font-bold cursor-pointer" style={{ color: '#4A6B74' }}>
                        Publish post immediately (visible to all visitors)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddBlogForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer hover:bg-slate-50"
                      style={{ color: '#789CA5', borderColor: 'rgba(0, 95, 115, 0.18)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-sm cursor-pointer disabled:opacity-50"
                      style={{ background: '#005F73' }}
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publish Post'}
                    </button>
                  </div>
                </form>
              ) : blogs && blogs.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgba(0, 95, 115, 0.15)', background: '#FFFFFF' }}>
                  <table className="w-full text-left border-collapse text-xs sm:text-sm" style={{ color: '#4A6B74' }}>
                    <thead className="border-b font-bold uppercase text-[10px]"
                      style={{ background: '#FFF9F4', borderBottomColor: 'rgba(0, 95, 115, 0.12)', color: '#0F2027' }}>
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4 text-right">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(0,95,115,0.08)]">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold" style={{ color: '#0F2027' }}>{b.title}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ background: 'rgba(0, 95, 115, 0.08)', color: '#005F73' }}>
                              {b.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              b.published
                                ? 'text-green-600 bg-green-50 border-green-200'
                                : 'text-slate-600 bg-slate-50 border-slate-200'
                            }`}>
                              {b.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4">{b.author?.name || 'Admin'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${b.title}"?`)) {
                                  deleteBlogMutation.mutate(b.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 transition cursor-pointer"
                              title="Delete post"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs" style={{ color: '#789CA5' }}>No blog articles composed yet.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
