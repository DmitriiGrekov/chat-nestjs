import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class MessageGateway implements OnModuleInit, OnGatewayConnection {
    private jwtService;
    constructor(jwtService: JwtService);
    server: Server;
    private userData;
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<void>;
    sendMessage(event: string, data: any): void;
    private getUserFromSocket;
}
