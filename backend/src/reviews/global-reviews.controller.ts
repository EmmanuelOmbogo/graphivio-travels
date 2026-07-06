import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class GlobalReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('latest')
  async findLatest(@Query('limit') limit?: string) {
    return this.reviewsService.findLatest(limit ? parseInt(limit) : 6);
  }
}
