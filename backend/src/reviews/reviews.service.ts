import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByTour(tourId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { tourId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reviews;
  }

  async findLatest(limit = 6) {
    const reviews = await this.prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        tour: { select: { id: true, title: true, location: true } },
      },
    });
    return reviews;
  }

  async create(tourId: string, userId: string, rating: number, reviewText: string) {
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) throw new NotFoundException('Tour not found');

    // Check if user already reviewed this tour
    const existing = await this.prisma.review.findUnique({
      where: { tourId_userId: { tourId, userId } },
    });
    if (existing) throw new ConflictException('You have already reviewed this tour');

    const review = await this.prisma.review.create({
      data: { tourId, userId, rating, reviewText },
      include: { user: { select: { id: true, name: true } } },
    });

    // Recalculate tour ratings
    const allReviews = await this.prisma.review.findMany({ where: { tourId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await this.prisma.tour.update({
      where: { id: tourId },
      data: {
        ratingsAverage: Math.round(avgRating * 10) / 10,
        ratingsQuantity: allReviews.length,
      },
    });

    return review;
  }
}
