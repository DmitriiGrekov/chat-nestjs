"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const rooms_module_1 = require("./rooms/rooms.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const jwt_auth_strategies_1 = require("./auth/strategies/jwt-auth.strategies");
const messages_module_1 = require("./messages/messages.module");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule, auth_module_1.AuthModule, rooms_module_1.RoomsModule, messages_module_1.MessagesModule,
            nestjs_redis_1.RedisModule.forRoot({
                config: {
                    host: process.env.REDIS_HOST,
                    port: +process.env.REDIS_PORT,
                    password: process.env.REDIS_PASSWORD
                }
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
                load: [configuration_1.default]
            }),
        ],
        controllers: [],
        providers: [jwt_auth_guard_1.JwtAuthGuard, jwt_auth_strategies_1.JwtStrategy, jwt_1.JwtService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map