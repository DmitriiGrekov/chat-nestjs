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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(createUserDto) {
        try {
            const userExists = await this.prismaService.user.findFirst({ where: { phone: createUserDto.phone } });
            if (userExists)
                throw new common_1.HttpException('Пользователь уже существует', common_1.HttpStatus.BAD_REQUEST);
            const hash = await bcrypt.hash(createUserDto.password, 10);
            return await this.prismaService.user.create({ data: Object.assign(Object.assign({}, createUserDto), { password: hash }) });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findAll() {
        try {
            return await this.prismaService.user.findMany();
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findOne(params) {
        try {
            const user = await this.prismaService.user.findFirst(params);
            if (!user)
                throw new common_1.HttpException("Пользователь не найден", common_1.HttpStatus.NOT_FOUND);
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.prismaService.user.findFirst({ where: { id: id } });
            if (!user)
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.user.update({ where: { id: id }, data: Object.assign({}, updateUserDto) });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async remove(id) {
        try {
            const user = await this.prismaService.user.findFirst({ where: { id: id } });
            if (!user)
                throw new common_1.HttpException('Пользователь не существует', common_1.HttpStatus.NOT_FOUND);
            return await this.prismaService.user.delete({ where: { id: id } });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    exclude(user, keys) {
        for (let key of keys) {
            delete user[key];
        }
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map