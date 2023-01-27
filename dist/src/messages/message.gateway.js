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
exports.MessageGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ioredis_1 = require("ioredis");
let MessageGateway = class MessageGateway {
    constructor(jwtService, redis) {
        this.jwtService = jwtService;
        this.redis = redis;
    }
    onModuleInit() {
        console.log('Message INIT');
    }
    async handleConnection(client) {
        const data = await this.getUserFromSocket(client);
        const redisRoom = JSON.parse(await this.redis.get(data.roomId.toString()));
        if (!redisRoom) {
            console.log(`Connect ${data.socketId}`);
            return await this.redis.set(data.roomId.toString(), JSON.stringify([data.socketId]).toString());
        }
        redisRoom.push(data.socketId);
        await this.redis.set(data.roomId.toString(), JSON.stringify(redisRoom));
        console.log(`Connect ${data.socketId}`);
    }
    async handleDisconnect(client) {
        const data = await this.getUserFromSocket(client);
        let redisRoom = JSON.parse(await this.redis.get(data.roomId.toString()));
        if (redisRoom.includes(data.socketId))
            redisRoom = redisRoom.filter((socket) => socket != data.socketId);
        await this.redis.set(data.roomId.toString(), JSON.stringify(redisRoom));
        console.log(`Disconnect ${data.socketId}`);
    }
    async sendMessage(data, roomId) {
        let redisRoom = JSON.parse(await this.redis.get(roomId.toString()));
        if (redisRoom)
            this.server.to(redisRoom).emit('message', data);
    }
    async getUserFromSocket(socket) {
        var _a;
        const token = (_a = socket.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        let userId;
        if (token)
            userId = this.jwtService.decode(token).sub;
        const roomId = +socket.handshake.query.room_id;
        const socketId = socket.id;
        return { userId, roomId, socketId };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleConnection", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleDisconnect", null);
MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, {
        cors: {
            origin: '*',
        },
        namespace: "message"
    }),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        ioredis_1.default])
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=message.gateway.js.map