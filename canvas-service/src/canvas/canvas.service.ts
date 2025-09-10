import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Canvas, CanvasDocument } from './schemas/canvas.schema';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { CanvasFilterDto } from './dto/canvas-filter.dto';
import { CanvasResponseDto } from './dto/canvas-response.dto';
import { CreateShapeDto } from './dto/create-shape.dto';
import { UpdateShapeDto } from './dto/update-shape.dto';

@Injectable()
export class CanvasService {
  constructor(
    @InjectModel(Canvas.name) private canvasModel: Model<CanvasDocument>,
    @Inject('ROOM_SERVICE') private roomService: ClientProxy,
  ) {}

  async create(createCanvasDto: CreateCanvasDto, userId: string): Promise<CanvasResponseDto> {
    try {
      const canvasId = `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const canvas = new this.canvasModel({
        canvasId,
        roomId: createCanvasDto.roomId,
        name: createCanvasDto.name || 'Untitled Canvas',
        settings: {
          background: {
            color: createCanvasDto.settings?.background?.color || '#ffffff',
            pattern: createCanvasDto.settings?.background?.pattern || 'none',
            patternSize: createCanvasDto.settings?.background?.patternSize || 20,
          },
          viewport: {
            zoom: createCanvasDto.settings?.viewport?.zoom || 1,
            panX: createCanvasDto.settings?.viewport?.panX || 0,
            panY: createCanvasDto.settings?.viewport?.panY || 0,
          },
          dimensions: {
            width: createCanvasDto.settings?.dimensions?.width || 2000,
            height: createCanvasDto.settings?.dimensions?.height || 1500,
          },
          permissions: {
            allowDrawing: createCanvasDto.settings?.permissions?.allowDrawing ?? true,
            allowShapes: createCanvasDto.settings?.permissions?.allowShapes ?? true,
            allowText: createCanvasDto.settings?.permissions?.allowText ?? true,
            allowDelete: createCanvasDto.settings?.permissions?.allowDelete ?? true,
          },
        },
        shapes: [],
        version: 1,
        modifiedBy: userId,
        history: [],
      });

      const savedCanvas = await canvas.save();
      
      // Emit event to room service for collaboration setup
      this.roomService.emit('canvas.created', {
        canvasId: savedCanvas.canvasId,
        roomId: savedCanvas.roomId,
        createdBy: userId,
      });

      return this.mapToResponseDto(savedCanvas);
    } catch (error) {
      throw new BadRequestException('Failed to create canvas');
    }
  }

  async findAll(filterDto: CanvasFilterDto): Promise<{
    canvases: CanvasResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      search,
      roomId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    if (roomId) {
      query.roomId = roomId;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute query
    const [canvases, total] = await Promise.all([
      this.canvasModel
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.canvasModel.countDocuments(query),
    ]);

    return {
      canvases: canvases.map(canvas => this.mapToResponseDto(canvas)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<CanvasResponseDto> {
    const canvas = await this.canvasModel.findOne({ canvasId: id }).exec();
    
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    return this.mapToResponseDto(canvas);
  }

  async update(id: string, updateCanvasDto: UpdateCanvasDto, userId: string): Promise<CanvasResponseDto> {
    const canvas = await this.canvasModel.findOne({ canvasId: id }).exec();
    
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    // Update canvas
    const updatedCanvas = await this.canvasModel
      .findOneAndUpdate(
        { canvasId: id },
        {
          ...updateCanvasDto,
          modifiedBy: userId,
          lastModified: new Date(),
          version: canvas.version + 1,
        },
        { new: true }
      )
      .exec();

    // Emit update event
    this.roomService.emit('canvas.updated', {
      canvasId: id,
      updatedBy: userId,
      version: updatedCanvas!.version,
      changes: updateCanvasDto,
    });

    return this.mapToResponseDto(updatedCanvas!);
  }

  async remove(id: string): Promise<void> {
    const result = await this.canvasModel.findOneAndDelete({ canvasId: id }).exec();
    
    if (!result) {
      throw new NotFoundException('Canvas not found');
    }

    // Emit delete event
    this.roomService.emit('canvas.deleted', {
      canvasId: id,
    });
  }

  // Shape management methods with proper DTOs
  async addShape(canvasId: string, createShapeDto: CreateShapeDto, userId: string): Promise<CanvasResponseDto> {
    const canvas = await this.canvasModel.findOne({ canvasId }).exec();
    
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    const shapeId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newShape: any = {
      id: shapeId,
      type: createShapeDto.type,
      position: createShapeDto.position,
      dimensions: createShapeDto.dimensions,
      style: createShapeDto.style,
      path: createShapeDto.path,
      rotation: createShapeDto.rotation || 0,
      locked: createShapeDto.locked || false,
      visible: createShapeDto.visible ?? true,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only add content if all required fields are present (for text shapes)
    if (
      createShapeDto.content &&
      typeof createShapeDto.content.text === 'string' &&
      typeof createShapeDto.content.fontSize === 'number' &&
      typeof createShapeDto.content.fontFamily === 'string'
    ) {
      newShape.content = {
        text: createShapeDto.content.text,
        fontSize: createShapeDto.content.fontSize,
        fontFamily: createShapeDto.content.fontFamily,
      };
    }

    canvas.shapes.push(newShape);
    canvas.modifiedBy = userId;
    canvas.lastModified = new Date();
    canvas.version += 1;

    // Add to history
    canvas.history.push({
      action: 'shape_added',
      shapeId,
      timestamp: new Date(),
      userId,
      data: { shapeType: createShapeDto.type },
    });

    const updatedCanvas = await canvas.save();

    // Emit shape added event
    this.roomService.emit('canvas.shape.added', {
      canvasId,
      shape: newShape,
      addedBy: userId,
    });

    return this.mapToResponseDto(updatedCanvas);
  }

  async updateShape(canvasId: string, shapeId: string, updateShapeDto: UpdateShapeDto, userId: string): Promise<CanvasResponseDto> {
    const canvas = await this.canvasModel.findOne({ canvasId }).exec();
    
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    const shapeIndex = canvas.shapes.findIndex(shape => shape.id === shapeId);
    
    if (shapeIndex === -1) {
      throw new NotFoundException('Shape not found');
    }

    // Update only provided fields
    const updatedShape = {
      ...canvas.shapes[shapeIndex],
      ...Object.fromEntries(
        Object.entries(updateShapeDto).filter(([_, value]) => value !== undefined)
      ),
      updatedAt: new Date(),
    };

    canvas.shapes[shapeIndex] = updatedShape;
    canvas.modifiedBy = userId;
    canvas.lastModified = new Date();
    canvas.version += 1;

    // Add to history
    canvas.history.push({
      action: 'shape_updated',
      shapeId,
      timestamp: new Date(),
      userId,
      data: updateShapeDto,
    });

    const updatedCanvas = await canvas.save();

    // Emit shape updated event
    this.roomService.emit('canvas.shape.updated', {
      canvasId,
      shapeId,
      shape: updatedShape,
      updatedBy: userId,
    });

    return this.mapToResponseDto(updatedCanvas);
  }

  async removeShape(canvasId: string, shapeId: string, userId: string): Promise<CanvasResponseDto> {
    const canvas = await this.canvasModel.findOne({ canvasId }).exec();
    
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    const shapeIndex = canvas.shapes.findIndex(shape => shape.id === shapeId);
    
    if (shapeIndex === -1) {
      throw new NotFoundException('Shape not found');
    }

    const removedShape = canvas.shapes[shapeIndex];
    canvas.shapes.splice(shapeIndex, 1);
    canvas.modifiedBy = userId;
    canvas.lastModified = new Date();
    canvas.version += 1;

    // Add to history
    canvas.history.push({
      action: 'shape_removed',
      shapeId,
      timestamp: new Date(),
      userId,
      data: { shapeType: removedShape.type },
    });

    const updatedCanvas = await canvas.save();

    // Emit shape removed event
    this.roomService.emit('canvas.shape.removed', {
      canvasId,
      shapeId,
      removedBy: userId,
    });

    return this.mapToResponseDto(updatedCanvas);
  }

  async getShape(canvasId: string, shapeId: string): Promise<any> {
    const canvas = await this.canvasModel.findOne({ canvasId }).exec();
    
    if (!canvas) {
      throw new NotFoundException('Canvas not found');
    }

    const shape = canvas.shapes.find(shape => shape.id === shapeId);
    
    if (!shape) {
      throw new NotFoundException('Shape not found');
    }

    return shape;
  }

  private mapToResponseDto(canvas: CanvasDocument): CanvasResponseDto {
    return {
      id: canvas._id.toString(),
      canvasId: canvas.canvasId,
      roomId: canvas.roomId,
      name: canvas.name,
      settings: canvas.settings,
      shapes: canvas.shapes,
      version: canvas.version,
      modifiedBy: canvas.modifiedBy,
      lastModified: canvas.lastModified,
      createdAt: canvas.createdAt,
      history: canvas.history,
    };
  }
}
