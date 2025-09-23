/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<any> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      // Return existing user formatted for frontend
      return {
        id: existingUser.id,
        name: `${existingUser.firstName} ${existingUser.lastName}`,
        email: existingUser.email,
        avatar: existingUser.avatar,
      };
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const user = new this.userModel({
      ...data,
      password: hashedPassword,
    });
    
    const savedUser = await user.save();
    
    // Return formatted for frontend
    return {
      id: savedUser.id,
      name: `${savedUser.firstName} ${savedUser.lastName}`,
      email: savedUser.email,
      avatar: savedUser.avatar,
    };
  }

  async findAll(): Promise<any[]> {
    const users = await this.userModel.find().exec();
    
    // Return formatted for frontend
    return users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.avatar,
    }));
  }

  async findById(id: string): Promise<any | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }

    // Return in format expected by frontend
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.avatar,
    };
  }

  async findByEmail(email: string): Promise<any | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    // Return in format expected by frontend
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.avatar,
    };
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
