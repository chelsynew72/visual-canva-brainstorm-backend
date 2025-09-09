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
exports.UserGatewayController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../src/shared/guards/jwt-auth.guard");
let UserGatewayController = class UserGatewayController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async findAll(query) {
        return this.userService.send('user.findAll', query);
    }
    async findOne(id) {
        return this.userService.send('user.findOne', { id });
    }
    async create(createUserDto) {
        return this.userService.send('user.create', createUserDto);
    }
    async update(id, updateUserDto) {
        return this.userService.send('user.update', { id, ...updateUserDto });
    }
    async remove(id) {
        return this.userService.send('user.remove', { id });
    }
    async getUserCanvases(id) {
        return this.userService.send('user.canvases', { id });
    }
    async updatePreferences(id, preferencesDto) {
        return this.userService.send('user.updatePreferences', { id, ...preferencesDto });
    }
};
exports.UserGatewayController = UserGatewayController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/canvases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user canvases' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "getUserCanvases", null);
__decorate([
    (0, common_1.Post)(':id/preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user preferences' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserGatewayController.prototype, "updatePreferences", null);
exports.UserGatewayController = UserGatewayController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)('USER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], UserGatewayController);
//# sourceMappingURL=user-gateway.controller.js.map