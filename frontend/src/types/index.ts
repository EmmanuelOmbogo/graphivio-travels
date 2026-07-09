export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
  location: string;
  imageCover: string;
  images: string[];
  maxGroupSize: number;
  difficulty: 'EASY' | 'MEDIUM' | 'DIFFICULT';
  ratingsAverage: number;
  ratingsQuantity: number;
  active: boolean;
  itinerary: ItineraryItem[];
  createdAt: string;
}

export type BookingStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface Booking {
  id: string;
  tourId: string;
  tour?: Tour;
  userId: string;
  user?: User;
  price: number;
  status: BookingStatus;
  bookingDate: string;
  travelersCount: number;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  tourId: string;
  userId: string;
  user?: {
    name: string;
  };
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  imageCover: string;
  published: boolean;
  createdAt: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
  };
}

