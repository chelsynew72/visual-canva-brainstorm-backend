import { Controller, Get, Post, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../src/shared/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatGatewayController {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatService: ClientProxy,
  ) {}

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Get chat messages for a room' })
  async getMessages(@Param('roomId') roomId: string, @Query() query: any) {
    return this.chatService.send('chat.getMessages', { roomId, ...query });
  }

  @Post('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Send a message to a room' })
  async sendMessage(@Param('roomId') roomId: string, @Body() messageDto: any) {
    return this.chatService.send('chat.sendMessage', { roomId, ...messageDto });
  }

  @Get('rooms/:roomId/history')
  @ApiOperation({ summary: 'Get chat history for a room' })
  async getChatHistory(@Param('roomId') roomId: string, @Query() query: any) {
    return this.chatService.send('chat.getHistory', { roomId, ...query });
  }

  @Post('rooms/:roomId/typing')
  @ApiOperation({ summary: 'Notify typing status' })
  async updateTyping(@Param('roomId') roomId: string, @Body() typingDto: any) {
    return this.chatService.send('chat.typing', { roomId, ...typingDto });
  }
}
