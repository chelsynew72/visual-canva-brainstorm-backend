import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('user-gateway')
@Controller('user-gateway')
export class UserGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getUserProfile(@Param('userId') userId: string) {
    const result = await this.userService.send('user.getProfile', { userId }).toPromise();
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Body() createUserDto: any) {
    const result = await this.userService.send('user.create', createUserDto).toPromise();
    return result;
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: any
  ) {
    const result = await this.userService.send('user.update', {
      userId,
      ...updateUserDto,
    }).toPromise();
    return result;
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('userId') userId: string) {
    const result = await this.userService.send('user.delete', { userId }).toPromise();
    return result;
  }
}
