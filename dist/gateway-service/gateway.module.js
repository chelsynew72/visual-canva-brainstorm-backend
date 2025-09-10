"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const auth_gateway_controller_1 = require("./auth-gateway.controller");
const canvas_gateway_controller_1 = require("./canvas-gateway.controller");
const user_gateway_controller_1 = require("./user-gateway.controller");
const chat_gateway_controller_1 = require("./chat-gateway.controller");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'AUTH_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('rabbitmq.url')],
                            queue: configService.get('services.auth.queue'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: 'CANVAS_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('rabbitmq.url')],
                            queue: configService.get('services.canvas.queue'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: 'USER_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('rabbitmq.url')],
                            queue: configService.get('services.user.queue'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
                {
                    name: 'CHAT_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [configService.get('rabbitmq.url')],
                            queue: configService.get('services.chat.queue'),
                            queueOptions: {
                                durable: true,
                            },
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        controllers: [
            auth_gateway_controller_1.AuthGatewayController,
            canvas_gateway_controller_1.CanvasGatewayController,
            user_gateway_controller_1.UserGatewayController,
            chat_gateway_controller_1.ChatGatewayController,
        ],
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map