import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  async validateUser(credentials: any) {
    // Use send() for request-response, or emit() for fire-and-forget
    return this.authClient.send({ cmd: 'validate_user' }, credentials).toPromise();
  }
}
