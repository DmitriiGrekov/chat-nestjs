import { Room } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto } from '../../src/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '../../src/rooms/dto/update-room.dto';
import { AddUserRoomDto } from '../../src/rooms//dto/add-user-room.dto';
import { DeleteUserRoomDto } from './dto/delete-user-room.dto';
import Redis from 'ioredis';
import { RoomsGateway } from './rooms.gateway';
export declare class RoomsService {
    private prismaService;
    private redis;
    private roomsGateway;
    constructor(prismaService: PrismaService, redis: Redis, roomsGateway: RoomsGateway);
    create(createRoomDto: CreateRoomDto, userId?: number): Promise<Room>;
    findAll(params?: {}): Promise<Room[]>;
    findOne(params?: {}): Promise<Room>;
    update(roomId: number, updateRoomDto: UpdateRoomDto, createrId: number): Promise<Room>;
    remove(id: number): Promise<Room>;
    addUserRoom(createrId: number, roomId: number, addUserRoomDto: AddUserRoomDto): Promise<Room>;
    deleteUserFromRoom(createrId: number, roomId: number, deleteUserRoomDto: DeleteUserRoomDto): Promise<Room & {
        users: {
            image: string;
            id: number;
            firstname: string;
            lastname: string;
            patroname: string;
        }[];
    }>;
}
