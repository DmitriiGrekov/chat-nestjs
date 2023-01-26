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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const jwt_auth_guard_1 = require("../../src/auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../src/auth/decorators/get-user.decorator");
const message_gateway_1 = require("./message.gateway");
let MessagesController = class MessagesController {
    constructor(messagesService, messageGateway, cacheManager) {
        this.messagesService = messagesService;
        this.messageGateway = messageGateway;
        this.cacheManager = cacheManager;
    }
    async send(createMessageDto, userId) {
        const message = await this.messagesService.send(createMessageDto, +userId);
        await this.cacheManager.set('name', 'Dmitrii');
        console.log(await this.cacheManager.get('name'));
        return message;
    }
    findAll(roomId, userId) {
        return this.messagesService.findAll({ where: { room_id: +roomId } }, +roomId, userId);
    }
    remove(id, userId) {
        return this.messagesService.remove(+id, userId);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Number]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "send", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rooms/:id/list'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "remove", null);
MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        message_gateway_1.MessageGateway, Object])
], MessagesController);
exports.MessagesController = MessagesController;
//# sourceMappingURL=messages.controller.js.map