/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
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
    console.log('🔑 DEBUG: JWT strategy validate called');
    console.log('🔑 DEBUG: JWT payload:', payload);
    
    // Try to find user in database
    const user = await this.userService.findById(payload.sub);
    console.log('🔑 DEBUG: User found in database:', user ? 'Yes' : 'No');
    
    if (!user) {
      // If user doesn't exist, return a basic profile from the JWT payload
      // In a real application, you'd want to sync user data between services
      const fallbackUser = {
        id: payload.sub,
        name: `${payload.firstName || 'User'} ${payload.lastName || payload.sub.slice(-4)}`, 
        email: payload.email,
      };
      console.log('🔑 DEBUG: Returning fallback user:', fallbackUser);
      return fallbackUser;
    }
    
    console.log('🔑 DEBUG: Returning database user:', user);
    return user;
  }
}
