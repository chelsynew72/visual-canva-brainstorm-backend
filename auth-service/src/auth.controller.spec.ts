import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and return result', async () => {
      const dto: SignupDto = { email: 'test@example.com', password: '123456', name: 'Test' };
      const result = { user: { email: dto.email, name: dto.name }, token: 'jwt-token' };
      mockAuthService.signup.mockResolvedValue(result);

      expect(await controller.signup(dto)).toEqual(result);
      expect(service.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: '123456' };
      const result = { user: { email: dto.email, name: 'Test' }, token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(dto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });
});
