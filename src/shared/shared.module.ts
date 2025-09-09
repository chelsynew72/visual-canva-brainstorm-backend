import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggerService } from './services/logger.service';
import { ValidationService } from './services/validation.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtAuthGuard,
    LoggerService,
    ValidationService,
    CacheService,
  ],
  exports: [
    JwtAuthGuard,
    LoggerService,
    ValidationService,
    CacheService,
    JwtModule,
  ],
})
export class SharedModule {}
