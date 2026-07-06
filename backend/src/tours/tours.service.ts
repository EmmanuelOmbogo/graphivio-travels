import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  private parseTourFields(tour: any) {
    if (!tour) return null;
    return {
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      itinerary: tour.itinerary ? JSON.parse(tour.itinerary) : [],
    };
  }

  async findAll(location?: string, difficulty?: string) {
    const where: any = { active: true };
    if (location) {
      where.location = { contains: location };
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const tours = await this.prisma.tour.findMany({ where });
    return tours.map((t) => this.parseTourFields(t));
  }

  async findOne(id: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
    });
    if (!tour) {
      throw new NotFoundException('Tour expedition not found');
    }
    return this.parseTourFields(tour);
  }

  async create(data: any) {
    const imagesStr = data.images ? JSON.stringify(data.images) : '[]';
    const itineraryStr = data.itinerary ? JSON.stringify(data.itinerary) : '[]';

    const tour = await this.prisma.tour.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        durationDays: data.durationDays,
        location: data.location,
        imageCover: data.imageCover,
        images: imagesStr,
        maxGroupSize: data.maxGroupSize,
        difficulty: data.difficulty || 'MEDIUM',
        itinerary: itineraryStr,
      },
    });

    return this.parseTourFields(tour);
  }

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.durationDays !== undefined) updateData.durationDays = data.durationDays;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.imageCover !== undefined) updateData.imageCover = data.imageCover;
    if (data.maxGroupSize !== undefined) updateData.maxGroupSize = data.maxGroupSize;
    if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
    if (data.active !== undefined) updateData.active = data.active;

    if (data.images !== undefined) {
      updateData.images = JSON.stringify(data.images);
    }
    if (data.itinerary !== undefined) {
      updateData.itinerary = JSON.stringify(data.itinerary);
    }

    const tour = await this.prisma.tour.update({
      where: { id },
      data: updateData,
    });

    return this.parseTourFields(tour);
  }

  async delete(id: string) {
    await this.prisma.tour.delete({
      where: { id },
    });
    return { success: true };
  }
}
