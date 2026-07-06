import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.bookingsService.create(req.user.id, body);
  }

  @Get('my-bookings')
  async findMyBookings(@Request() req: any) {
    return this.bookingsService.findMyBookings(req.user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.bookingsService.updateStatus(id, status, req.user.id, req.user.role);
  }

  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancelBooking(id, req.user.id);
  }
}
