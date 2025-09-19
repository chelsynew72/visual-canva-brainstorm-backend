import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user.service';

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

  async validate(payload: any) {
    // Try to find user in database
    const user = await this.userService.findById(payload.sub);
    
    if (!user) {
      // If user doesn't exist, return a basic profile from the JWT payload
      // In a real application, you'd want to sync user data between services
      return {
        id: payload.sub,
        name: `User ${payload.sub.slice(-4)}`, // Basic fallback name
        email: payload.email,
      };
    }
    
    return user;
  }
}
