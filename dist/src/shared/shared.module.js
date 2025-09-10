"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const logger_service_1 = require("./services/logger.service");
const validation_service_1 = require("./services/validation.service");
const cache_service_1 = require("./services/cache.service");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('jwt.secret'),
                    signOptions: {
                        expiresIn: configService.get('jwt.expiresIn'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            jwt_auth_guard_1.JwtAuthGuard,
            logger_service_1.LoggerService,
            validation_service_1.ValidationService,
            cache_service_1.CacheService,
        ],
        exports: [
            jwt_auth_guard_1.JwtAuthGuard,
            logger_service_1.LoggerService,
            validation_service_1.ValidationService,
            cache_service_1.CacheService,
            jwt_1.JwtModule,
        ],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map