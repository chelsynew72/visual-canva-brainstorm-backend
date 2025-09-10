"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasGatewayController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../src/shared/guards/jwt-auth.guard");
let CanvasGatewayController = class CanvasGatewayController {
    canvasService;
    constructor(canvasService) {
        this.canvasService = canvasService;
    }
    async findAll(query) {
        return this.canvasService.send('canvas.findAll', query);
    }
    async findOne(id) {
        return this.canvasService.send('canvas.findOne', { id });
    }
    async create(createCanvasDto) {
        return this.canvasService.send('canvas.create', createCanvasDto);
    }
    async update(id, updateCanvasDto) {
        return this.canvasService.send('canvas.update', { id, ...updateCanvasDto });
    }
    async remove(id) {
        return this.canvasService.send('canvas.remove', { id });
    }
    async addShape(canvasId, shapeDto) {
        return this.canvasService.send('canvas.addShape', { canvasId, ...shapeDto });
    }
    async updateShape(canvasId, shapeId, updateShapeDto) {
        return this.canvasService.send('canvas.updateShape', {
            canvasId,
            shapeId,
            ...updateShapeDto,
        });
    }
    async removeShape(canvasId, shapeId) {
        return this.canvasService.send('canvas.removeShape', { canvasId, shapeId });
    }
};
exports.CanvasGatewayController = CanvasGatewayController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all canvases' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get canvas by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new canvas' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update canvas' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete canvas' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/shapes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add shape to canvas' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "addShape", null);
__decorate([
    (0, common_1.Put)(':canvasId/shapes/:shapeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update shape in canvas' }),
    __param(0, (0, common_1.Param)('canvasId')),
    __param(1, (0, common_1.Param)('shapeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "updateShape", null);
__decorate([
    (0, common_1.Delete)(':canvasId/shapes/:shapeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove shape from canvas' }),
    __param(0, (0, common_1.Param)('canvasId')),
    __param(1, (0, common_1.Param)('shapeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CanvasGatewayController.prototype, "removeShape", null);
exports.CanvasGatewayController = CanvasGatewayController = __decorate([
    (0, swagger_1.ApiTags)('canvas'),
    (0, common_1.Controller)('canvas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)('CANVAS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], CanvasGatewayController);
//# sourceMappingURL=canvas-gateway.controller.js.map