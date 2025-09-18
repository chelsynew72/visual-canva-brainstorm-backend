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
    
    // Notify other users in the room
    client.to(canvasId).emit('userJoined', {
      userId: client.id,
      userData: { name: `User ${client.id.slice(-4)}` }
    });
  }

  @SubscribeMessage('leaveCanvas')
  handleLeaveCanvas(@MessageBody() canvasId: string, @ConnectedSocket() client: Socket) {
    client.leave(canvasId);
    console.log(`Client ${client.id} left canvas ${canvasId}`);
    
    // Notify other users in the room
    client.to(canvasId).emit('userLeft', {
      userId: client.id
    });
  }

  @SubscribeMessage('canvasUpdate')
  handleCanvasUpdate(
    @MessageBody() data: { 
      canvasId: string; 
      payload: { 
        type: string;
        shapes?: any[];
        shape?: any;
        shapeIds?: string[];
        userId?: string;
      } 
    },
    @ConnectedSocket() client: Socket
  ) {
    console.log(`Canvas update from ${client.id}:`, {
      canvasId: data.canvasId,
      type: data.payload.type,
      shapesCount: data.payload.shapes?.length,
      userId: data.payload.userId
    });
    
    // Broadcast to all other clients in the same canvas room
    client.to(data.canvasId).emit('canvasUpdated', {
      ...data.payload,
      userId: client.id
    });
  }
}
