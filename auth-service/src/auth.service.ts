import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(signupDto.password, saltRounds);

    // Create user
    const user = new this.userModel({
      ...signupDto,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Generate JWT token
    const payload = { sub: savedUser._id, email: savedUser.email };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password, ...userResult } = savedUser.toObject();

    return { user: userResult, token };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
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

    // Generate JWT token
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password, ...userResult } = user.toObject();

    return { user: userResult, token };
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password');
  }
}
