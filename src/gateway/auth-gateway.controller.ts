import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignupDto } from '@auth/dto/signup.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto): Observable<any> {
    return this.client.send('signup', signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Observable<any> {
    return this.client.send('login', loginDto);
  }
}
