
import { Injectable } from '@nestjs/common';
import { CollaborationGateway } from './collaboration.gateway';

@Injectable()
export class CollaborationService {
  constructor(private readonly collaborationGateway: CollaborationGateway) {}

  broadcastCanvasUpdate(canvasId: string, payload: any) {
    this.collaborationGateway.server.to(canvasId).emit('canvasUpdated', payload);
  }
}
