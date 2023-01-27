import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
export declare class MessageGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private redis;
    constructor(jwtService: JwtService, redis: Redis);
    server: Server;
    private userData;
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<"OK">;
    handleDisconnect(client: Socket): Promise<void>;
    sendMessage(data: any, roomId: number): Promise<void>;
    private getUserFromSocket;
}
