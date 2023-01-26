import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    sendMessage(event: string, data: any): boolean;
}
