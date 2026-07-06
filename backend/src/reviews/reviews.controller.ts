import { Controller, Get, Post, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tours/:tourId/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  async findByTour(@Param('tourId') tourId: string) {
    return this.reviewsService.findByTour(tourId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('tourId') tourId: string,
    @Request() req: any,
    @Body('rating') rating: number,
    @Body('reviewText') reviewText: string,
  ) {
    return this.reviewsService.create(tourId, req.user.id, rating, reviewText);
  }
}
