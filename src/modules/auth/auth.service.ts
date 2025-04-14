import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper, hashValue } from '@/helpers/util';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async generateTokens(user: any) {
    const payload = { email: user?.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async login(user: any) {
    const { refreshToken, accessToken } = await this.generateTokens(user);
    const valueHashRefreshToken: string = await hashValue(refreshToken);
    await this.usersService.update({
      _id: user?._id,
      refreshToken: valueHashRefreshToken,
    });
    return {
      user: {
        email: user?.email,
        _id: user._id,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(valueRefreshToken: string) {
    try {
      // Verify token validity
      const resultDecode = this.jwtService.decode(valueRefreshToken);

      if (!resultDecode) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find user by refresh token
      const user = await this.usersService.findByEmail(resultDecode?.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isValidRefreshToken: boolean = await bcrypt.compare(
        valueRefreshToken,
        user?.refreshToken,
      );

      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.login(user);
    } catch (error) {
      console.log('error:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.create(registerDto);
  }
}
