import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') pass: string,
    @Body('name') name: string,
  ) {
    return this.authService.register(email, pass, name);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') pass: string) {
    return this.authService.login(email, pass);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
