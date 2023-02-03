import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
export declare class RoomsGateway implements OnModuleInit, OnGatewayConnection {
    private jwtService;
    private redis;
    constructor(jwtService: JwtService, redis: Redis);
    server: Server;
    private userData;
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<boolean>;
    handleDisconnect(client: Socket): Promise<boolean>;
    sendMessage(event: string, data: any): void;
    sentNotification(socketId: string, data: any): void;
}
