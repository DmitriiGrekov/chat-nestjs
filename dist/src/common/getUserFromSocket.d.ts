import { Socket } from 'socket.io';
export declare function getUserFromSocket(socket: Socket): Promise<{
    userId: any;
    roomId: number;
    socketId: string;
}>;
