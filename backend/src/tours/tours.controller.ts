import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tours')
export class ToursController {
  constructor(private toursService: ToursService) {}

  @Get()
  async findAll(
    @Query('location') location?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.toursService.findAll(location, difficulty);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() body: any) {
    return this.toursService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.toursService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.toursService.delete(id);
  }
}
