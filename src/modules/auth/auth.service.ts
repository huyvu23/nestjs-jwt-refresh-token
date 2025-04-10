import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/helpers/util';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // So sánh pass người dùng gửi lên và pass của người dùng tìm thấy trong DB
    const isValidPassword: boolean = await comparePasswordHelper(
      pass,
      user.password,
    );

    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user?.email, sub: user._id };

    return {
      user: {
        email: user?.email,
        _id: user._id,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
