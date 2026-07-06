import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ToursService, PrismaService],
  controllers: [ToursController],
  exports: [ToursService],
})
export class ToursModule {}
