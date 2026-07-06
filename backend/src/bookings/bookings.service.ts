import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    // Get the tour price
    const tour = await this.prisma.tour.findUnique({ where: { id: data.tourId } });
    if (!tour) throw new NotFoundException('Tour not found');

    const totalPrice = tour.price * data.travelersCount;
    const contactInfoStr = JSON.stringify(data.contactInfo);

    const booking = await this.prisma.booking.create({
      data: {
        tourId: data.tourId,
        userId,
        price: totalPrice,
        status: 'PENDING',
        bookingDate: new Date(data.bookingDate),
        travelersCount: data.travelersCount,
        contactInfo: contactInfoStr,
      },
      include: { tour: true, user: true },
    });

    return this.parseBooking(booking);
  }

  async findMyBookings(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { tour: true },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(this.parseBooking);
  }

  async findAll() {
    const bookings = await this.prisma.booking.findMany({
      include: { tour: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(this.parseBooking);
  }

  async updateStatus(id: string, status: string, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    // Customers can only cancel their own bookings
    if (userRole !== 'ADMIN') {
      if (booking.userId !== userId) throw new ForbiddenException('Access denied');
      if (status !== 'CANCELLED') throw new ForbiddenException('Customers can only cancel bookings');
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { tour: true },
    });

    return this.parseBooking(updated);
  }

  async cancelBooking(id: string, userId: string) {
    return this.updateStatus(id, 'CANCELLED', userId, 'CUSTOMER');
  }

  private parseBooking(booking: any) {
    return {
      ...booking,
      contactInfo: booking.contactInfo ? JSON.parse(booking.contactInfo) : {},
      tour: booking.tour ? {
        ...booking.tour,
        images: booking.tour.images ? JSON.parse(booking.tour.images) : [],
        itinerary: booking.tour.itinerary ? JSON.parse(booking.tour.itinerary) : [],
      } : undefined,
    };
  }
}
