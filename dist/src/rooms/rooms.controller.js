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
let RoomsController = class RoomsController {
    constructor(roomsService, messageService, jwtService) {
        this.roomsService = roomsService;
        this.messageService = messageService;
        this.jwtService = jwtService;
    }
    async root(token) {
        const userId = await this.jwtService.decode(token.access_token);
        const rooms = await this.roomsService.findAll({
            where: { users: { some: { id: +userId.sub } } },
            include: {
                users: {
                    select: {
                        firstname: true,
                        lastname: true,
                        patroname: true,
                        id: true,
                        image: true,
                    },
                },
            },
        });
        return { rooms: rooms };
    }
    async rootOne(id) {
        const room = await this.roomsService.findOne({ where: { id: +id } });
        const messages = await this.messageService.findAll({
            where: { room_id: +id },
            include: { User: { select: { firstname: true, lastname: true, patroname: true, image: true, id: true } } },
            orderBy: { created_at: "desc" },
            take: 7
        }, +id, +48);
        console.log(messages);
        return { room: room, messages: messages.reverse() };
    }
    async create(createRoomDto, userId) {
        const room = await this.roomsService.create(createRoomDto, userId);
        return this.roomsService.addUserRoom(userId, room.id, { userId: userId });
    }
    findAll(userId) {
        console.log('hello');
        return this.roomsService.findAll({
            where: { users: { some: { id: +userId } } },
            include: {
                users: {
                    select: {
                        firstname: true,
                        lastname: true,
                        patroname: true,
                        id: true,
                        image: true,
                    },
                },
                message: true,
            },
        });
    }
    findOne(id, userId) {
        return this.roomsService.findOne({
            where: { AND: [{ id: +id }, { users: { some: { id: userId } } }] },
            include: {
                users: {
                    select: {
                        firstname: true,
                        lastname: true,
                        patroname: true,
                        id: true,
                    },
                },
                message: {
                    include: {
                        User: {
                            select: { id: true, firstname: true, lastname: true, patroname: true }
                        }
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
        return this.roomsService.addUserRoom(createrId, +roomId, addUserRoomDto);
    }
};
__decorate([
    (0, common_1.Get)('index/view'),
    (0, common_1.Render)("index"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('index/one/view/:id'),
    (0, common_1.Render)("one-room"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RoomsController.prototype, "rootOne", null);
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
    __metadata("design:returntype", void 0)
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
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        messages_service_1.MessagesService,
        jwt_1.JwtService])
], RoomsController);
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map