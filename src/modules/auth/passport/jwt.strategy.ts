import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      /**
       * Where to find the JWT in the request
       * @see https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /**
       * Whether to ignore the expiration date of the JWT
       * @see https://github.com/mikenicholson/passport-jwt#ignoreexpiration
       */
      ignoreExpiration: false,
      /**
       * The secret to use when verifying the JWT
       * @see https://github.com/mikenicholson/passport-jwt#secretorkey
       */
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Called when a JWT is received from the client and verified.
   * If the JWT is valid, the method should return the user's data.
   * If the JWT is invalid, the method should throw an exception.
   * @param payload The payload extracted from the JWT
   * @returns The user's data
   */
  async validate(payload: {
    email: string;
    sub: string;
    iat: number;
    exp: number;
  }): Promise<{ email: string; _id: string }> {
    // payload chính là data mà lúc sign token đã encode vào
    return {
      email: payload.email,
      _id: payload.sub,
    };
  }
}
