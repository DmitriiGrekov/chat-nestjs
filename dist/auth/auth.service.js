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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(jwtService, prismaService) {
        this.jwtService = jwtService;
        this.prismaService = prismaService;
    }
    async validateUser(login, pass) {
        const user = await this.prismaService.user.findFirst({ where: { login: login } });
        if (!user)
            throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
        if (user && await bcrypt.compare(pass, user.password)) {
            return user;
        }
        return null;
    }
    async login(authLoginDto) {
        try {
            const validateUser = await this.validateUser(authLoginDto.login, authLoginDto.password);
            if (!validateUser)
                throw new common_1.HttpException('Вы ввели не правильный логин или пароль', common_1.HttpStatus.FORBIDDEN);
            const payload = { login: validateUser.login, sub: validateUser.id, name: `${validateUser.firstname} ${validateUser.lastname}` };
            return {
                access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
                user_id: validateUser.id,
                login: validateUser.login
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, prisma_service_1.PrismaService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map