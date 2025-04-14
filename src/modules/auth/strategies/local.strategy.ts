import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Specify that 'email' is the field to use instead of 'username'
    });
  }

  /**
   * This method is called by Passport when a local strategy is used
   * (i.e. when a user is logging in with their email and password).
   * It is used to validate the user's credentials.
   *
   * @param email The email of the user
   * @param password The password of the user
   * @returns The user object if the credentials are valid, otherwise throws an UnauthorizedException
   */
  async validate(email: string, password: string): Promise<any> {
    // Call the validateUser method of the AuthService to validate the user's credentials
    const user = await this.authService.validateUser(email, password);

    // If the user is not found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException();
    }

    // Return the user object
    return user;
  }
}
