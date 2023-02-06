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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const rooms_gateway_1 = require("./rooms.gateway");
const users_controller_1 = require("../users/users.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let RoomsService = class RoomsService {
    constructor(prismaService, redis, roomsGateway) {
        this.prismaService = prismaService;
        this.redis = redis;
        this.roomsGateway = roomsGateway;
    }
    async create(createRoomDto, userId) {
        try {
            const user = await this.prismaService.user.findFirst({ where: { id: userId } });
            if (!user)
                throw new common_1.HttpException("Пользователь не найден", common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.create({ data: Object.assign(Object.assign({}, createRoomDto), { creater: { connect: { id: userId } } }) });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findAll(params = {}) {
        try {
            return await this.prismaService.room.findMany(params);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findOne(id, otherWhere = {}, otherIncludes = {}) {
        try {
            const room = await this.prismaService.room.findFirst({
                where: { AND: [{ id: +id }, Object.assign({}, otherWhere)] },
                include: Object.assign({ users: Object.assign({}, users_controller_1.userSelect), message: {
                        include: {
                            User: Object.assign({}, users_controller_1.userSelect),
                        }
                    } }, otherIncludes),
            });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            return room;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async update(roomId, createrId, data = {}, includeParams = {}) {
        try {
            const room = await this.findOne(+roomId, { creater_id: createrId });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.update(Object.assign({ where: { id: roomId }, data: Object.assign({}, data) }, includeParams));
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async remove(id) {
        try {
            const room = await this.findOne(+id);
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.delete({ where: { id: id } });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async addUserRoom(createrId, roomId, addUserRoomDto) {
        try {
            const room = await this.findOne(+roomId, { creater_id: createrId });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            const user = await this.prismaService.user.findFirst({ where: { id: addUserRoomDto.userId } });
            if (!user)
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
            const response = await this.update(+roomId, createrId, {
                users: {
                    connect: { id: addUserRoomDto.userId }
                }
            }, { include: { users: { select: { id: true, firstname: true, lastname: true, patroname: true, image: true } } } });
            let socketId = await this.redis.get(addUserRoomDto.userId.toString());
            if (socketId) {
                this.roomsGateway.sentNotification(socketId, response);
            }
            return response;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async deleteUserFromRoom(createrId, roomId, deleteUserRoomDto) {
        try {
            const room = await this.findOne(+roomId, { creater_id: createrId });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            const user = await this.prismaService.user.findFirst({ where: { id: deleteUserRoomDto.userId } });
            if (!user)
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
            return await this.update(+roomId, +createrId, {
                users: {
                    disconnect: [{ id: deleteUserRoomDto.userId }]
                }
            }, { include: { users: { select: { id: true, firstname: true, lastname: true, patroname: true, image: true } } } });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ioredis_1.default,
        rooms_gateway_1.RoomsGateway])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map