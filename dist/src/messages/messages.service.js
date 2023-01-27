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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const rooms_service_1 = require("../../src/rooms/rooms.service");
let MessagesService = class MessagesService {
    constructor(prismaService, roomService) {
        this.prismaService = prismaService;
        this.roomService = roomService;
    }
    async send(createMessageDto, userId) {
        try {
            const room = await this.roomService.findOne({
                where: {
                    AND: [
                        { id: createMessageDto.room_id },
                        { users: { some: { id: userId } } },
                    ],
                },
            });
            if (!room)
                throw new common_1.HttpException("Вы не являетесь участником данной комнаты", common_1.HttpStatus.BAD_REQUEST);
            return await this.prismaService.message.create({
                data: Object.assign(Object.assign({}, createMessageDto), { user_id: userId }),
                include: { User: { select: { firstname: true, lastname: true, patroname: true, id: true } } }
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findAll(params = {}, roomId, userId) {
        try {
            const room = await this.roomService.findOne({
                where: { AND: [{ id: roomId }, { users: { some: { id: userId } } }] },
                include: { users: true },
            });
            if (!room)
                throw new common_1.HttpException("Вы не являетесь участником данной комнаты", common_1.HttpStatus.BAD_REQUEST);
            return await this.prismaService.message.findMany(params);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
    async remove(id, user_id) {
        try {
            const message = await this.prismaService.message.findFirst({
                where: { user_id, id },
            });
            if (!message)
                throw new common_1.HttpException("Сообщение не найдено", common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.message.delete({ where: { id } });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rooms_service_1.RoomsService])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map