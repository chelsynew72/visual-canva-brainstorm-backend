import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('canvas-gateway')
@Controller('canvas-gateway')
export class CanvasGatewayController {
  constructor(
    @Inject('CANVAS_SERVICE') private readonly canvasService: ClientProxy,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check for canvas gateway' })
  @ApiResponse({ status: 200, description: 'Gateway is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      service: 'canvas-gateway',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('rooms/:roomId/join')
  @ApiOperation({ summary: 'Join a canvas room' })
  @ApiResponse({ status: 200, description: 'Successfully joined room' })
  async joinRoom(
    @Param('roomId') roomId: string,
    @Body() joinData: { userId: string; userName: string }
  ) {
    // Forward to canvas service
    const result = await this.canvasService.send('canvas.room.join', {
      roomId,
      userId: joinData.userId,
      userName: joinData.userName,
    }).toPromise();

    return {
      roomId,
      userId: joinData.userId,
      joinedAt: new Date().toISOString(),
      ...result,
    };
  }

  @Post('rooms/:roomId/leave')
  @ApiOperation({ summary: 'Leave a canvas room' })
  @ApiResponse({ status: 200, description: 'Successfully left room' })
  async leaveRoom(
    @Param('roomId') roomId: string,
    @Body() leaveData: { userId: string }
  ) {
    // Forward to canvas service
    const result = await this.canvasService.send('canvas.room.leave', {
      roomId,
      userId: leaveData.userId,
    }).toPromise();

    return {
      roomId,
      userId: leaveData.userId,
      leftAt: new Date().toISOString(),
      ...result,
    };
  }

  @Get('rooms/:roomId/participants')
  @ApiOperation({ summary: 'Get active participants in a room' })
  @ApiResponse({ status: 200, description: 'List of active participants' })
  async getRoomParticipants(@Param('roomId') roomId: string) {
    // Forward to canvas service
    const result = await this.canvasService.send('canvas.room.participants', {
      roomId,
    }).toPromise();

    return {
      roomId,
      participants: result.participants || [],
      count: result.count || 0,
    };
  }

  @Post('canvas/:canvasId/broadcast')
  @ApiOperation({ summary: 'Broadcast canvas updates to all connected clients' })
  @ApiResponse({ status: 200, description: 'Update broadcasted successfully' })
  async broadcastCanvasUpdate(
    @Param('canvasId') canvasId: string,
    @Body() updateData: any
  ) {
    // Forward to canvas service for broadcasting
    const result = await this.canvasService.send('canvas.broadcast', {
      canvasId,
      updateData,
    }).toPromise();

    return {
      canvasId,
      broadcasted: true,
      timestamp: new Date().toISOString(),
      ...result,
    };
  }

  @Get('canvas/:canvasId')
  @ApiOperation({ summary: 'Get canvas data' })
  @ApiResponse({ status: 200, description: 'Canvas data retrieved successfully' })
  async getCanvas(@Param('canvasId') canvasId: string) {
    const result = await this.canvasService.send('canvas.get', { canvasId }).toPromise();
    return result;
  }

  @Post('canvas')
  @ApiOperation({ summary: 'Create a new canvas' })
  @ApiResponse({ status: 201, description: 'Canvas created successfully' })
  async createCanvas(@Body() createCanvasDto: any) {
    const result = await this.canvasService.send('canvas.create', createCanvasDto).toPromise();
    return result;
  }

  @Put('canvas/:canvasId')
  @ApiOperation({ summary: 'Update canvas' })
  @ApiResponse({ status: 200, description: 'Canvas updated successfully' })
  async updateCanvas(
    @Param('canvasId') canvasId: string,
    @Body() updateCanvasDto: any
  ) {
    const result = await this.canvasService.send('canvas.update', {
      canvasId,
      ...updateCanvasDto,
    }).toPromise();
    return result;
  }

  @Delete('canvas/:canvasId')
  @ApiOperation({ summary: 'Delete canvas' })
  @ApiResponse({ status: 200, description: 'Canvas deleted successfully' })
  async deleteCanvas(@Param('canvasId') canvasId: string) {
    const result = await this.canvasService.send('canvas.delete', { canvasId }).toPromise();
    return result;
  }
}