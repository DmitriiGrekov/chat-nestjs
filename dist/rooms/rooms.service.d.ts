import { Room } from '@prisma/client';
import { CreateRoomDto } from '../../src/rooms/dto/create-room.dto';
import { AddUserRoomDto } from '../../src/rooms//dto/add-user-room.dto';
import { DeleteUserRoomDto } from './dto/delete-user-room.dto';
import Redis from 'ioredis';
import { RoomsGateway } from './rooms.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class RoomsService {
    private prismaService;
    private redis;
    private roomsGateway;
    constructor(prismaService: PrismaService, redis: Redis, roomsGateway: RoomsGateway);
    create(createRoomDto: CreateRoomDto, userId?: number): Promise<Room>;
    findAll(params?: {}): Promise<Room[]>;
    findOne(id: number, otherWhere?: {}, otherIncludes?: {}): Promise<Room>;
    update(roomId: number, createrId: number, data?: {}, includeParams?: {}): Promise<Room>;
    remove(id: number): Promise<Room>;
    addUserRoom(createrId: number, roomId: number, addUserRoomDto: AddUserRoomDto): Promise<Room>;
    deleteUserFromRoom(createrId: number, roomId: number, deleteUserRoomDto: DeleteUserRoomDto): Promise<Room>;
}
