"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
let LoggerService = class LoggerService {
    context;
    setContext(context) {
        this.context = context;
    }
    log(message, context) {
        const ctx = context || this.context;
        console.log(`[${new Date().toISOString()}] [LOG] ${ctx ? `[${ctx}] ` : ''}${message}`);
    }
    error(message, trace, context) {
        const ctx = context || this.context;
        console.error(`[${new Date().toISOString()}] [ERROR] ${ctx ? `[${ctx}] ` : ''}${message}`);
        if (trace) {
            console.error(trace);
        }
    }
    warn(message, context) {
        const ctx = context || this.context;
        console.warn(`[${new Date().toISOString()}] [WARN] ${ctx ? `[${ctx}] ` : ''}${message}`);
    }
    debug(message, context) {
        const ctx = context || this.context;
        console.debug(`[${new Date().toISOString()}] [DEBUG] ${ctx ? `[${ctx}] ` : ''}${message}`);
    }
    verbose(message, context) {
        const ctx = context || this.context;
        console.log(`[${new Date().toISOString()}] [VERBOSE] ${ctx ? `[${ctx}] ` : ''}${message}`);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)()
], LoggerService);
//# sourceMappingURL=logger.service.js.map