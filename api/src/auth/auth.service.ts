import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
)
{}

  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByUsername(username);
    console.log(user)
    console.log(password)
    console.log('match?', user.password.trim() === password.trim())

    if (user && user.password.trim() === password.trim()) { 
        const payload = {username:user.username, sub: user.id}
        const accessToken = this.jwtService.sign(payload)
        return { accessToken}
    }

    throw new UnauthorizedException('Invalid credentials..');
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
