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
exports.ChatGatewayController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../src/shared/guards/jwt-auth.guard");
let ChatGatewayController = class ChatGatewayController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getMessages(roomId, query) {
        return this.chatService.send('chat.getMessages', { roomId, ...query });
    }
    async sendMessage(roomId, messageDto) {
        return this.chatService.send('chat.sendMessage', { roomId, ...messageDto });
    }
    async getChatHistory(roomId, query) {
        return this.chatService.send('chat.getHistory', { roomId, ...query });
    }
    async updateTyping(roomId, typingDto) {
        return this.chatService.send('chat.typing', { roomId, ...typingDto });
    }
};
exports.ChatGatewayController = ChatGatewayController;
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat messages for a room' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGatewayController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to a room' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGatewayController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat history for a room' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGatewayController.prototype, "getChatHistory", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/typing'),
    (0, swagger_1.ApiOperation)({ summary: 'Notify typing status' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGatewayController.prototype, "updateTyping", null);
exports.ChatGatewayController = ChatGatewayController = __decorate([
    (0, swagger_1.ApiTags)('chat'),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)('CHAT_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], ChatGatewayController);
//# sourceMappingURL=chat-gateway.controller.js.map