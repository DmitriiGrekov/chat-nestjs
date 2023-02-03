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
const getUserFromSocket_1 = require("../common/getUserFromSocket");
let MessageGateway = class MessageGateway {
    constructor(jwtService, redis) {
        this.jwtService = jwtService;
        this.redis = redis;
    }
    onModuleInit() {
    }
    async handleConnection(client) {
        const data = await (0, getUserFromSocket_1.getUserFromSocket)(client);
        if (!data)
            return;
        const redisRoom = JSON.parse(await this.redis.get(`room_id-${data === null || data === void 0 ? void 0 : data.roomId}`));
        const userSocket = { userId: data.userId, socketId: data.socketId };
        if (!redisRoom) {
            return await this.redis.set(`room_id-${data === null || data === void 0 ? void 0 : data.roomId}`, JSON.stringify([userSocket]).toString());
        }
        let userExists = redisRoom.findIndex((user) => user.userId === data.userId);
        if (userExists >= 0) {
            redisRoom[userExists].socketId = data.socketId;
            return await this.redis.set(`room_id-${data === null || data === void 0 ? void 0 : data.roomId}`, JSON.stringify(redisRoom));
        }
        redisRoom.push(userSocket);
        await this.redis.set(`room_id-${data === null || data === void 0 ? void 0 : data.roomId}`, JSON.stringify(redisRoom));
    }
    async handleDisconnect(client) {
        const data = await (0, getUserFromSocket_1.getUserFromSocket)(client);
        if (!data)
            return;
        const dateDisconected = new Date();
        const redisUser = JSON.parse(await this.redis.get(`user_id-${data === null || data === void 0 ? void 0 : data.userId}`));
        if (!redisUser) {
            const newUser = [{ [data.roomId]: { date_closed: dateDisconected.toString() } }];
            console.log(`Disconnect Message ${client.id} `);
            return await this.redis.set(`user_id-${data === null || data === void 0 ? void 0 : data.userId}`, JSON.stringify(newUser));
        }
        redisUser.forEach(user => {
            if (user[data.roomId])
                return user[data.roomId] = dateDisconected;
            user[data.roomId] = dateDisconected;
        });
        await this.redis.set(`user_id-${data === null || data === void 0 ? void 0 : data.userId}`, JSON.stringify(redisUser));
        console.log(`Disconnect Message ${client.id} `);
    }
    async sendMessage(data, roomId) {
        let redisRoom = JSON.parse(await this.redis.get(`room_id-${roomId.toString()}`));
        if (!redisRoom)
            throw new common_1.HttpException('Ошибка отправки сообщения', common_1.HttpStatus.BAD_GATEWAY);
        const socketIds = redisRoom.map(r => { return r.socketId; });
        console.log(socketIds);
        if (redisRoom)
            this.server.to(socketIds).emit('message', data);
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
        namespace: "message"
    }),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        ioredis_1.default])
], MessageGateway);
exports.MessageGateway = MessageGateway;
//# sourceMappingURL=message.gateway.js.map