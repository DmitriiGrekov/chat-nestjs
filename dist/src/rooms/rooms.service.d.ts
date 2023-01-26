import { Room } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto } from '../../src/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '../../src/rooms/dto/update-room.dto';
import { AddUserRoomDto } from '../../src/rooms//dto/add-user-room.dto';
import { DeleteUserRoomDto } from './dto/delete-user-room.dto';
export declare class RoomsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(createRoomDto: CreateRoomDto, userId?: number): Promise<Room>;
    findAll(params?: {}): Promise<Room[]>;
    findOne(params?: {}): Promise<Room>;
    update(roomId: number, updateRoomDto: UpdateRoomDto, createrId: number): Promise<Room>;
    remove(id: number): Promise<Room>;
    addUserRoom(createrId: number, roomId: number, addUserRoomDto: AddUserRoomDto): Promise<Room>;
    deleteUserFromRoom(createrId: number, roomId: number, deleteUserRoomDto: DeleteUserRoomDto): Promise<Room & {
        users: {
            firstname: string;
            lastname: string;
            patroname: string;
            image: string;
            id: number;
        }[];
    }>;
}
