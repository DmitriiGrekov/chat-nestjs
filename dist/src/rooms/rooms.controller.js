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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("./rooms.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const jwt_auth_guard_1 = require("../../src/auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../src/auth/decorators/get-user.decorator");
const add_user_room_dto_1 = require("./dto/add-user-room.dto");
const delete_user_room_dto_1 = require("./dto/delete-user-room.dto");
const messages_service_1 = require("../messages/messages.service");
const jwt_1 = require("@nestjs/jwt");
const users_controller_1 = require("../users/users.controller");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ioredis_1 = require("ioredis");
let RoomsController = class RoomsController {
    constructor(roomsService, messageService, jwtService, redis) {
        this.roomsService = roomsService;
        this.messageService = messageService;
        this.jwtService = jwtService;
        this.redis = redis;
    }
    async create(createRoomDto, userId) {
        const room = await this.roomsService.create(createRoomDto, userId);
        return this.roomsService.addUserRoom(userId, room.id, { userId: userId });
    }
    async findAll(userId) {
        const rooms = await this.roomsService.findAll({
            where: { users: { some: { id: +userId } } },
            orderBy: { created_at: 'desc' },
            include: {
                users: Object.assign({}, users_controller_1.userSelect),
                message: true,
            },
        });
        const redisUser = JSON.parse(await this.redis.get(`user_id-${userId}`));
        rooms.forEach(room => {
            const dateDisconected = redisUser[0][room.id];
            const unreadMessage = room['message'].filter(m => {
                return new Date(m.created_at) > new Date(dateDisconected);
            });
            room['unreadMessage'] = unreadMessage.length;
        });
        return rooms;
    }
    findOne(id, userId) {
        return this.roomsService.findOne({
            where: { AND: [{ id: +id }, { users: { some: { id: userId } } }] },
            include: {
                users: Object.assign({}, users_controller_1.userSelect),
                message: {
                    include: {
                        User: Object.assign({}, users_controller_1.userSelect)
                    }
                },
            },
        });
    }
    update(roomId, updateRoomDto, createrId) {
        return this.roomsService.update(+roomId, updateRoomDto, createrId);
    }
    remove(id) {
        return this.roomsService.remove(+id);
    }
    deleteUserFromRoom(roomId, deleteUserRoomDto, createrId) {
        return this.roomsService.deleteUserFromRoom(createrId, +roomId, deleteUserRoomDto);
    }
    addUserRoom(roomId, addUserRoomDto, createrId) {
        console.log(addUserRoomDto);
        return this.roomsService.addUserRoom(createrId, +roomId, addUserRoomDto);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto, Number]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("list"),
    __param(0, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(":roomId"),
    __param(0, (0, common_1.Param)("roomId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto, Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(":roomId/user/disconnect"),
    __param(0, (0, common_1.Param)("roomId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, delete_user_room_dto_1.DeleteUserRoomDto, Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "deleteUserFromRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(":roomId/user"),
    __param(0, (0, common_1.Param)("roomId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_user_room_dto_1.AddUserRoomDto, Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "addUserRoom", null);
RoomsController = __decorate([
    (0, common_1.Controller)("rooms"),
    __param(3, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        messages_service_1.MessagesService,
        jwt_1.JwtService,
        ioredis_1.default])
], RoomsController);
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map