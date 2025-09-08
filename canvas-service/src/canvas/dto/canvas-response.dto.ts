export class CanvasResponseDto {
  canvasId: string;
  roomId: string;
  name: string;
  settings: {
    background: {
      color: string;
      pattern: string;
      patternSize: number;
    };
    viewport: {
      zoom: number;
      panX: number;
      panY: number;
    };
    dimensions: {
      width: number;
      height: number;
    };
    permissions: {
      allowDrawing: boolean;
      allowShapes: boolean;
      allowText: boolean;
      allowDelete: boolean;
    };
  };
  shapes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    dimensions?: { width: number; height: number };
    style: {
      fillColor: string;
      strokeColor: string;
      strokeWidth: number;
      opacity: number;
    };
    content?: {
      text: string;
      fontSize: number;
      fontFamily: string;
    };
    path?: Array<{ x: number; y: number }>;
    rotation: number;
    locked: boolean;
    visible: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  version: number;
  lastModified: Date;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
