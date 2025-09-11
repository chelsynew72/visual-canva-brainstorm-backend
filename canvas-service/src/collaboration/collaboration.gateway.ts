// This file manages WebSocket connections, It includes handlers for when clients connect, disconnect, and send messages. It also has methods for joining and leaving specific canvas rooms.

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinCanvas')
  handleJoinCanvas(@MessageBody() canvasId: string, @ConnectedSocket() client: Socket) {
    client.join(canvasId);
    console.log(`Client ${client.id} joined canvas ${canvasId}`);
  }

  @SubscribeMessage('leaveCanvas')
  handleLeaveCanvas(@MessageBody() canvasId: string, @ConnectedSocket() client: Socket) {
    client.leave(canvasId);
    console.log(`Client ${client.id} left canvas ${canvasId}`);
  }

  @SubscribeMessage('canvasUpdate')
  handleCanvasUpdate(@MessageBody() data: any) {
    this.server.to(data.canvasId).emit('canvasUpdated', data.payload);
  }
}
