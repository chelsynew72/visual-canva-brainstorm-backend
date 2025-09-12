import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from '../gateway-service/gateway.module';
import { SharedModule } from './shared/shared.module';
import configuration from './config/configuration';
import { UserModule } from '@user/user.module';


@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ✅ Database connection (MongoDB)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/brainstorm',
      }),
    }),

    UserModule,

    // Gateway module for routing to microservices
    GatewayModule,

    // Shared utilities and common functionality
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
