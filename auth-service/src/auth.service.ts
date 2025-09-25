/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly USER_SERVICE_URL = 'http://localhost:3004';

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async syncUserWithUserService(userData: any) {
    try {
      const response = await fetch(`${this.USER_SERVICE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          authServiceId: userData._id.toString(), // Link to auth service user
        }),
      });

      if (!response.ok) {
        console.warn(
          'Failed to sync user with user service:',
          response.statusText,
        );
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn('Error syncing user with user service:', error);
      return null;
    }
  }

  async signup(signupDto: SignupDto) {
    // Check if user already exists in auth service
    const existingUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);

    // Create user in auth service (for authentication)
    const user = new this.userModel({
      ...signupDto,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Sync user data with user service (single source of truth for user data)
    const userServiceUser = await this.syncUserWithUserService(savedUser);

    // Generate JWT token with user service ID if available, fallback to auth service ID
    const userId = userServiceUser?.id || savedUser._id;
    const payload = {
      sub: userId,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password, ...userResult } = savedUser.toObject();

    return { user: userResult, token };
  }

  async login(loginDto: LoginDto) {
    // Find user by email in auth service
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user data from user service (single source of truth)
    let userServiceUser: any = null;
    try {
      const response = await fetch(
        `${this.USER_SERVICE_URL}/users?email=${user.email}`,
      );
      if (response.ok) {
        const users: any[] = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        userServiceUser = users.find((u: any) => u.email === user.email);
      }
    } catch (error) {
      console.warn('Could not fetch user from user service:', error);
    }

    // Generate JWT token with user service ID if available, fallback to auth service ID
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = userServiceUser?.id || user._id;
    const payload = {
      sub: userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password, ...userResult } = user.toObject();

    return { user: userResult, token };
  }

  async validateUser(payload: any) {
    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { userId: user.id, email: user.email };
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      return null;
    }

    // Transform to frontend format
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
  }
}
