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
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ioredis_1 = require("ioredis");
const getUserFromSocket_1 = require("../common/getUserFromSocket");
let ChatGateway = class ChatGateway {
    constructor(jwtService, redis) {
        this.jwtService = jwtService;
        this.redis = redis;
    }
    onModuleInit() { }
    async handleConnection(client) {
        const user = await (0, getUserFromSocket_1.getUserFromSocket)(client);
        if (user === null)
            return false;
        const siteConnectedArray = JSON.parse(await this.redis.get("siteConnected"));
        if (!siteConnectedArray)
            return false;
        if (siteConnectedArray.find((conn) => Object.keys(conn).includes(user.userId.toString())))
            return false;
        siteConnectedArray.push({ [user.userId]: user.socketId });
        await this.redis.set("siteConnected", JSON.stringify(siteConnectedArray));
        console.log(`Connect chat ${user.socketId} `);
    }
    async handleDisconnect(client) {
        const user = await (0, getUserFromSocket_1.getUserFromSocket)(client);
        if (user === null)
            return false;
        const siteConnectedArray = JSON.parse(await this.redis.get("siteConnected"));
        if (!siteConnectedArray)
            return false;
        siteConnectedArray.pop({ [user.userId.toString()]: user.socketId });
        console.log(siteConnectedArray);
        await this.redis.set("siteConnected", JSON.stringify(siteConnectedArray));
        console.log(`Disconnect site ${client.id}`);
    }
    sendUnreadedMessage(data, sockets) {
        this.server.to(sockets).emit("chatsUnreadedMessage", data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDisconnect", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, {
        cors: true,
        namespace: "chat",
    }),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        ioredis_1.default])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map