import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    this.logger.debug(`Authorization header: ${typeof authHeader === 'string' ? authHeader.slice(0,100) : String(authHeader)}`);
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      this.logger.warn('No token found in Authorization header');
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Prefer JwtService's configured secret (don't override here) so behaviour is consistent with JwtModule
      const payload = this.jwtService.verify(token);
      this.logger.debug(`JWT verified, payload keys: ${payload ? Object.keys(payload).join(',') : 'none'}`);
      request['user'] = payload;
    } catch (err) {
      this.logger.error('JWT verification failed for token (trimmed): ' + (token ? token.slice(0,80) : 'no-token'));
  this.logger.error('JWT verification error: ' + ((err as any)?.message ?? String(err)));
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
