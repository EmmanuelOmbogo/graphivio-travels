import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [BlogsService, PrismaService],
  controllers: [BlogsController],
  exports: [BlogsService],
})
export class BlogsModule {}
