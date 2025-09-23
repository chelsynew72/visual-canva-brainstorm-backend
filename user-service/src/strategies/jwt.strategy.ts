/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user.service';

interface JwtPayload {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
  iat: number;
  exp: number;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<UserResponse> {
    // Try to find user in database
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      // If user doesn't exist, return a basic profile from the JWT payload
      // In a real application, you'd want to sync user data between services
      const fallbackUser: UserResponse = {
        id: payload.sub,
        name:
          `${payload.firstName || 'User'} ${payload.lastName || ''}`.trim() ||
          `User ${payload.sub.slice(-4)}`,
        email: payload.email,
      };
      return fallbackUser;
    }

    return user;
  }
}
