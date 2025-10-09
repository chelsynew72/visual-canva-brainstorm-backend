import { Controller, Get } from '@nestjs/common';

@Controller()
export class GatewayController {
  @Get()
  healthCheck() {
    return { status: 'Gateway is running' };
  }
}