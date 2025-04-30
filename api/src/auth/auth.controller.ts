import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    try {
      return await this.authService.login(username, password);
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
