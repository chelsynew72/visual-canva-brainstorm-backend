"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    cache = new Map();
    set(key, value, ttlSeconds = 3600) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { value, expiresAt });
    }
    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            return null;
        }
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }
    delete(key) {
        return this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    has(key) {
        const item = this.cache.get(key);
        if (!item) {
            return false;
        }
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    keys() {
        const validKeys = [];
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now <= item.expiresAt) {
                validKeys.push(key);
            }
            else {
                this.cache.delete(key);
            }
        }
        return validKeys;
    }
    size() {
        this.cleanupExpired();
        return this.cache.size;
    }
    cleanupExpired() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map