import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../src/shared/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Query() query: any) {
    return this.userService.send('user.findAll', query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.userService.send('user.findOne', { id });
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: any) {
    return this.userService.send('user.create', createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.userService.send('user.update', { id, ...updateUserDto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async remove(@Param('id') id: string) {
    return this.userService.send('user.remove', { id });
  }

  @Get(':id/canvases')
  @ApiOperation({ summary: 'Get user canvases' })
  async getUserCanvases(@Param('id') id: string) {
    return this.userService.send('user.canvases', { id });
  }

  @Post(':id/preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  async updatePreferences(@Param('id') id: string, @Body() preferencesDto: any) {
    return this.userService.send('user.updatePreferences', { id, ...preferencesDto });
  }
}
