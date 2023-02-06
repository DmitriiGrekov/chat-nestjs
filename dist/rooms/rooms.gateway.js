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
exports.RoomsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ioredis_1 = require("ioredis");
const getUserFromSocket_1 = require("../common/getUserFromSocket");
let RoomsGateway = class RoomsGateway {
    constructor(jwtService, redis) {
        this.jwtService = jwtService;
        this.redis = redis;
    }
    onModuleInit() {
    }
    async handleConnection(client) {
        const user = await (0, getUserFromSocket_1.getUserFromSocket)(client);
        if (user === null)
            return false;
        await this.redis.set(user.userId.toString(), user.socketId.toString());
    }
    async handleDisconnect(client) {
        var _a;
        const data = await (0, getUserFromSocket_1.getUserFromSocket)(client);
        if (data === null)
            return false;
        let redisRoom = await this.redis.get((_a = data.userId) === null || _a === void 0 ? void 0 : _a.toString());
        if (redisRoom)
            await this.redis.del(data.userId.toString());
    }
    sendMessage(event, data) {
        this.server.to(this.userData.socketId).emit(data);
    }
    sentNotification(socketId, data) {
        this.server.to(socketId).emit('addUserRoom', data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleConnection", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleDisconnect", null);
RoomsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, {
        cors: true,
        namespace: "rooms"
    }),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [jwt_1.JwtService, ioredis_1.default])
], RoomsGateway);
exports.RoomsGateway = RoomsGateway;
//# sourceMappingURL=rooms.gateway.js.map