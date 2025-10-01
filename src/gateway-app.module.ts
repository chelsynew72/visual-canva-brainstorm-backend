import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway-service/src/gateway.module';

@Module({
  imports: [GatewayModule],
})
export class GatewayAppModule {}
