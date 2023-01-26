"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsModule = void 0;
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("../../src/rooms/rooms.service");
const rooms_controller_1 = require("../../src/rooms/rooms.controller");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_auth_strategies_1 = require("../../src/auth/strategies/jwt-auth.strategies");
const rooms_gateway_1 = require("./rooms.gateway");
const jwt_1 = require("@nestjs/jwt");
let RoomsModule = class RoomsModule {
};
RoomsModule = __decorate([
    (0, common_1.Module)({
        controllers: [rooms_controller_1.RoomsController],
        providers: [rooms_service_1.RoomsService, prisma_service_1.PrismaService, jwt_auth_strategies_1.JwtStrategy, rooms_gateway_1.RoomsGateway, jwt_1.JwtService]
    })
], RoomsModule);
exports.RoomsModule = RoomsModule;
//# sourceMappingURL=rooms.module.js.map