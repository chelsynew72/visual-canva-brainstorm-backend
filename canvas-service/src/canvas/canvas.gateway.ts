import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { CreateShapeDto } from './dto/create-shape.dto';
import { UpdateShapeDto } from './dto/update-shape.dto';

interface CanvasClient extends Socket {
  userId?: string;
  canvasId?: string;
  userName?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/canvas',
})
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CanvasGateway.name);

  // Store active connections per canvas
  private canvasConnections = new Map<string, Set<CanvasClient>>();

  constructor(private readonly canvasService: CanvasService) {}

  async handleConnection(client: CanvasClient) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: CanvasClient) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    if (client.canvasId) {
      await this.leaveCanvas(client, { canvasId: client.canvasId });
    }
  }

  @SubscribeMessage('join-canvas')
  async joinCanvas(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { canvasId: string; userId: string; userName: string }
  ) {
    try {
      const { canvasId, userId, userName } = data;

      // Verify canvas exists
      await this.canvasService.findOne(canvasId);

      // Set client properties
      client.userId = userId;
      client.canvasId = canvasId;
      client.userName = userName;

      // Join socket room
      client.join(`canvas:${canvasId}`);

      // Track connection
      if (!this.canvasConnections.has(canvasId)) {
        this.canvasConnections.set(canvasId, new Set());
      }
      this.canvasConnections.get(canvasId)!.add(client);

      // Notify other users
      client.to(`canvas:${canvasId}`).emit('user-joined', {
        userId,
        userName,
        timestamp: new Date(),
      });

      // Send current canvas state to joining user
      const canvas = await this.canvasService.findOne(canvasId);
      client.emit('canvas-state', canvas);

      // Send list of active users
      const activeUsers = Array.from(this.canvasConnections.get(canvasId) || [])
        .map(c => ({ userId: c.userId, userName: c.userName }))
        .filter(u => u.userId !== userId);
      
      client.emit('active-users', activeUsers);

      this.logger.log(`User ${userName} joined canvas ${canvasId}`);

      return { success: true, message: 'Joined canvas successfully' };
    } catch (error) {
      this.logger.error(`Failed to join canvas: ${(error as Error).message}`);
      client.emit('error', { message: 'Failed to join canvas' });
      return { success: false, message: (error as Error).message };
    }
  }

  @SubscribeMessage('leave-canvas')
  async leaveCanvas(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { canvasId: string }
  ) {
    const { canvasId } = data;
    const userId = client.userId;
    const userName = client.userName;

    // Leave socket room
    client.leave(`canvas:${canvasId}`);

    // Remove from tracking
    if (this.canvasConnections.has(canvasId)) {
      this.canvasConnections.get(canvasId)!.delete(client);
      if (this.canvasConnections.get(canvasId)!.size === 0) {
        this.canvasConnections.delete(canvasId);
      }
    }

    // Notify other users
    if (userId && userName) {
      client.to(`canvas:${canvasId}`).emit('user-left', {
        userId,
        userName,
        timestamp: new Date(),
      });
    }

    // Clear client properties
    client.canvasId = undefined;
    client.userId = undefined;
    client.userName = undefined;

    this.logger.log(`User ${userName} left canvas ${canvasId}`);

    return { success: true, message: 'Left canvas successfully' };
  }

  @SubscribeMessage('add-shape')
  async addShape(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { createShapeDto: CreateShapeDto }
  ) {
    try {
      if (!client.canvasId || !client.userId) {
        throw new Error('Client not joined to canvas');
      }

      const result = await this.canvasService.addShape(
        client.canvasId,
        data.createShapeDto,
        client.userId
      );

      // Broadcast to all clients in the canvas (including sender for confirmation)
      this.server.to(`canvas:${client.canvasId}`).emit('shape-added', {
        shape: result.shapes[result.shapes.length - 1], // Get the newly added shape
        addedBy: { userId: client.userId, userName: client.userName },
        timestamp: new Date(),
        version: result.version,
      });

      return { success: true, shape: result.shapes[result.shapes.length - 1] };
    } catch (error) {
      this.logger.error(`Failed to add shape: ${(error as Error).message}`);
      client.emit('error', { message: 'Failed to add shape' });
      return { success: false, message: (error as Error).message };
    }
  }

  @SubscribeMessage('update-shape')
  async updateShape(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { shapeId: string; updateShapeDto: UpdateShapeDto }
  ) {
    try {
      if (!client.canvasId || !client.userId) {
        throw new Error('Client not joined to canvas');
      }

      const result = await this.canvasService.updateShape(
        client.canvasId,
        data.shapeId,
        data.updateShapeDto,
        client.userId
      );

      const updatedShape = result.shapes.find(s => s.id === data.shapeId);

      // Broadcast to all clients in the canvas
      this.server.to(`canvas:${client.canvasId}`).emit('shape-updated', {
        shapeId: data.shapeId,
        shape: updatedShape,
        updatedBy: { userId: client.userId, userName: client.userName },
        timestamp: new Date(),
        version: result.version,
      });

      return { success: true, shape: updatedShape };
    } catch (error) {
      this.logger.error(`Failed to update shape: ${(error as Error).message}`);
      client.emit('error', { message: 'Failed to update shape' });
      return { success: false, message: (error as Error).message };
    }
  }

  @SubscribeMessage('remove-shape')
  async removeShape(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { shapeId: string }
  ) {
    try {
      if (!client.canvasId || !client.userId) {
        throw new Error('Client not joined to canvas');
      }

      const result = await this.canvasService.removeShape(
        client.canvasId,
        data.shapeId,
        client.userId
      );

      // Broadcast to all clients in the canvas
      this.server.to(`canvas:${client.canvasId}`).emit('shape-removed', {
        shapeId: data.shapeId,
        removedBy: { userId: client.userId, userName: client.userName },
        timestamp: new Date(),
        version: result.version,
      });

      return { success: true, message: 'Shape removed successfully' };
    } catch (error) {
      this.logger.error(`Failed to remove shape: ${(error as Error).message}`);
      client.emit('error', { message: 'Failed to remove shape' });
      return { success: false, message: (error as Error).message };
    }
  }

  @SubscribeMessage('cursor-move')
  async cursorMove(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { x: number; y: number }
  ) {
    if (!client.canvasId || !client.userId) {
      return;
    }

    // Broadcast cursor position to other users (not to sender)
    client.to(`canvas:${client.canvasId}`).emit('cursor-moved', {
      userId: client.userId,
      userName: client.userName,
      position: { x: data.x, y: data.y },
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('canvas-viewport-change')
  async viewportChange(
    @ConnectedSocket() client: CanvasClient,
    @MessageBody() data: { zoom: number; panX: number; panY: number }
  ) {
    try {
      if (!client.canvasId || !client.userId) {
        throw new Error('Client not joined to canvas');
      }

      // Update canvas settings
      const updateDto = {
        settings: {
          viewport: {
            zoom: data.zoom,
            panX: data.panX,
            panY: data.panY,
          },
        },
      };

      await this.canvasService.update(client.canvasId, updateDto, client.userId);

      // Optionally broadcast viewport changes to other users
      // client.to(`canvas:${client.canvasId}`).emit('viewport-changed', {
      //   userId: client.userId,
      //   viewport: data,
      // });

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to update viewport: ${(error as Error).message}`);
      return { success: false, message: (error as Error).message };
    }
  }

  // Utility method to get active users in a canvas
  getActiveUsers(canvasId: string) {
    const connections = this.canvasConnections.get(canvasId);
    if (!connections) return [];

    return Array.from(connections).map(client => ({
      userId: client.userId,
      userName: client.userName,
      socketId: client.id,
    }));
  }
}
