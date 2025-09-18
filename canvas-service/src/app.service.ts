import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Canvas, CanvasDocument } from './canvas/schemas/canvas.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Canvas.name) private canvasModel: Model<CanvasDocument>,
  ) {}

  getHello(): string {
    return 'Canvas Service is running! 🎨';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'canvas-service',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      dependencies: {
        mongodb: 'connected',
        rabbitmq: 'connected',
      },
    };
  }

  async saveCanvas(canvasData: any) {
    try {
      console.log('Saving canvas data to MongoDB:', {
        roomId: canvasData.roomId,
        title: canvasData.title,
        shapesCount: canvasData.shapes?.length || 0
      });

      // Check if canvas exists for this room
      let canvas = await this.canvasModel.findOne({ roomId: canvasData.roomId }).exec();
      
      if (canvas) {
        // Update existing canvas
        canvas.name = canvasData.title || canvas.name;
        canvas.shapes = this.transformShapesToSchema(canvasData.shapes || []);
        canvas.modifiedBy = 'mock-user';
        canvas.lastModified = new Date();
        canvas.version += 1;
        
        await canvas.save();
        console.log('Updated existing canvas in MongoDB:', canvas.canvasId);
      } else {
        // Create new canvas
        const canvasId = `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        canvas = new this.canvasModel({
          canvasId,
          roomId: canvasData.roomId,
          name: canvasData.title || 'Untitled Canvas',
          shapes: this.transformShapesToSchema(canvasData.shapes || []),
          modifiedBy: 'mock-user',
          lastModified: new Date(),
          version: 1,
        });
        
        await canvas.save();
        console.log('Created new canvas in MongoDB:', canvasId);
      }

      return {
        success: true,
        message: 'Canvas saved successfully to MongoDB',
        roomId: canvasData.roomId,
        canvasId: canvas.canvasId,
        shapesCount: canvasData.shapes?.length || 0,
        savedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error saving canvas to MongoDB:', error);
      return {
        success: false,
        message: 'Failed to save canvas to MongoDB',
        error: error.message,
        roomId: canvasData.roomId,
        savedAt: new Date().toISOString()
      };
    }
  }

  async loadCanvas(roomId: string) {
    try {
      console.log('Loading canvas data from MongoDB for room:', roomId);
      
      const canvas = await this.canvasModel.findOne({ roomId }).exec();
      
      if (!canvas) {
        console.log('No canvas found for room:', roomId);
        return {
          success: false,
          message: 'No canvas found for this room',
          roomId
        };
      }

      console.log('Found canvas in MongoDB:', canvas.canvasId, 'with', canvas.shapes?.length || 0, 'shapes');
      
      return {
        success: true,
        message: 'Canvas loaded successfully from MongoDB',
        roomId,
        canvasId: canvas.canvasId,
        title: canvas.name,
        description: 'Collaborative canvas session',
        shapes: this.transformShapesFromSchema(canvas.shapes || []),
        createdAt: canvas.createdAt,
        updatedAt: canvas.lastModified
      };
    } catch (error) {
      console.error('Error loading canvas from MongoDB:', error);
      return {
        success: false,
        message: 'Failed to load canvas from MongoDB',
        error: error.message,
        roomId
      };
    }
  }

  private transformShapesToSchema(frontendShapes: any[]): any[] {
    return frontendShapes.map(shape => ({
      id: shape.id,
      type: shape.type,
      position: { x: shape.x || 0, y: shape.y || 0 },
      dimensions: shape.width && shape.height ? { width: shape.width, height: shape.height } : undefined,
      style: {
        fillColor: shape.color || shape.fill || '#000000',
        strokeColor: shape.color || shape.stroke || '#000000',
        strokeWidth: shape.size || shape.strokeWidth || 2,
        opacity: 1
      },
      content: shape.text ? {
        text: shape.text,
        fontSize: 16,
        fontFamily: 'Arial'
      } : undefined,
      path: shape.points ? shape.points.map((point, index) => 
        index % 2 === 0 ? { x: point, y: shape.points[index + 1] || 0 } : null
      ).filter(Boolean) : undefined,
      rotation: 0,
      locked: false,
      visible: true,
      createdBy: shape.userId || 'mock-user',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  private transformShapesFromSchema(schemaShapes: any[]): any[] {
    return schemaShapes.map(shape => ({
      id: shape.id,
      type: shape.type,
      x: shape.position?.x || 0,
      y: shape.position?.y || 0,
      width: shape.dimensions?.width,
      height: shape.dimensions?.height,
      radius: shape.type === 'circle' ? (shape.dimensions?.width / 2 || 50) : undefined,
      color: shape.style?.fillColor || shape.style?.strokeColor || '#000000',
      size: shape.style?.strokeWidth || 2,
      text: shape.content?.text,
      points: shape.path ? shape.path.flatMap((point: any) => [point.x, point.y]) : undefined,
      draggable: true,
      tool: shape.type === 'line' ? 'brush' : undefined,
      userId: shape.createdBy || 'unknown'
    }));
  }
}
