"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const messages_controller_1 = require("./messages.controller");
const message_gateway_1 = require("./message.gateway");
const jwt_1 = require("@nestjs/jwt");
const rooms_gateway_1 = require("../rooms/rooms.gateway");
const chat_gateway_1 = require("../rooms/chat.gateway");
const prisma_service_1 = require("../prisma/prisma.service");
const rooms_service_1 = require("../rooms/rooms.service");
let MessagesModule = class MessagesModule {
};
MessagesModule = __decorate([
    (0, common_1.Module)({
        controllers: [messages_controller_1.MessagesController],
        providers: [messages_service_1.MessagesService, prisma_service_1.PrismaService, rooms_service_1.RoomsService, message_gateway_1.MessageGateway, jwt_1.JwtService, rooms_gateway_1.RoomsGateway, chat_gateway_1.ChatGateway],
    })
], MessagesModule);
exports.MessagesModule = MessagesModule;
//# sourceMappingURL=messages.module.js.map