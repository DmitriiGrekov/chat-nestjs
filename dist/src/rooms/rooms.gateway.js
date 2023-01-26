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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const jwt_1 = require("@nestjs/jwt");
let RoomsGateway = class RoomsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    onModuleInit() {
        console.log('init');
    }
    async handleConnection(client) {
        const user = await this.getUserFromSocket(client);
        this.userData = user;
    }
    sendMessage(event, data) {
        console.log(this.userData);
        this.server.to(this.userData.socketId).emit(data);
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
], RoomsGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], RoomsGateway.prototype, "handleConnection", null);
RoomsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, {
        cors: {
            origin: '*',
        },
        namespace: "rooms"
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], RoomsGateway);
exports.RoomsGateway = RoomsGateway;
//# sourceMappingURL=rooms.gateway.js.map