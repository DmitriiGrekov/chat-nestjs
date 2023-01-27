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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RoomsService = class RoomsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
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
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
    async findOne(params = {}) {
        try {
            const room = await this.prismaService.room.findFirst(params);
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            return room;
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
    async update(roomId, updateRoomDto, createrId) {
        try {
            const room = await this.prismaService.room.findFirst({ where: { id: roomId, creater_id: createrId } });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.update({ where: { id: roomId }, data: Object.assign({}, updateRoomDto) });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async remove(id) {
        try {
            const room = await this.prismaService.room.findFirst({ where: { id: id } });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.delete({ where: { id: id } });
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
    async addUserRoom(createrId, roomId, addUserRoomDto) {
        try {
            const room = await this.prismaService.room.findFirst({ where: { id: roomId, creater_id: createrId } });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            const user = await this.prismaService.user.findFirst({ where: { id: addUserRoomDto.userId } });
            if (!user)
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.update({
                where: { id: roomId },
                data: {
                    users: {
                        connect: { id: addUserRoomDto.userId }
                    }
                },
                include: { users: { select: { id: true, firstname: true, lastname: true, patroname: true, image: true } } }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async deleteUserFromRoom(createrId, roomId, deleteUserRoomDto) {
        try {
            const room = await this.prismaService.room.findFirst({ where: { id: roomId, creater_id: createrId } });
            if (!room)
                throw new common_1.HttpException('Комната не найдена', common_1.HttpStatus.NOT_FOUND);
            const user = await this.prismaService.user.findFirst({ where: { id: deleteUserRoomDto.userId } });
            if (!user)
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.room.update({
                where: { id: roomId },
                data: {
                    users: {
                        disconnect: [{ id: deleteUserRoomDto.userId }]
                    }
                },
                include: { users: { select: { id: true, firstname: true, lastname: true, patroname: true, image: true } } }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map