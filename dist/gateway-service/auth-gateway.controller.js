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
exports.AuthGatewayController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../src/shared/guards/jwt-auth.guard");
let AuthGatewayController = class AuthGatewayController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.send('auth.register', registerDto);
    }
    async login(loginDto) {
        return this.authService.send('auth.login', loginDto);
    }
    async refresh(refreshDto) {
        return this.authService.send('auth.refresh', refreshDto);
    }
    async logout(logoutDto) {
        return this.authService.send('auth.logout', logoutDto);
    }
    async getProfile(id) {
        return this.authService.send('auth.profile', { id });
    }
    async verifyToken(tokenDto) {
        return this.authService.send('auth.verify', tokenDto);
    }
};
exports.AuthGatewayController = AuthGatewayController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthGatewayController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthGatewayController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthGatewayController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthGatewayController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthGatewayController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('verify-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify JWT token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthGatewayController.prototype, "verifyToken", null);
exports.AuthGatewayController = AuthGatewayController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], AuthGatewayController);
//# sourceMappingURL=auth-gateway.controller.js.map