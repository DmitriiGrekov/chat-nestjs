import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { AddUserRoomDto } from "./dto/add-user-room.dto";
import { DeleteUserRoomDto } from "./dto/delete-user-room.dto";
import Redis from "ioredis";
import { OptionsDto } from "src/config/dto/options.dto";
export declare class RoomsController {
    private readonly roomsService;
    private redis;
    constructor(roomsService: RoomsService, redis: Redis);
    create(createRoomDto: CreateRoomDto, userId: number): Promise<import(".prisma/client").Room>;
    findAll(userId: number, optionsDto: OptionsDto): Promise<import(".prisma/client").Room[]>;
    findOne(id: string, userId: number): Promise<import(".prisma/client").Room>;
    update(roomId: string, updateRoomDto: UpdateRoomDto, createrId: number): Promise<import(".prisma/client").Room>;
    remove(id: string): Promise<import(".prisma/client").Room>;
    deleteUserFromRoom(roomId: number, deleteUserRoomDto: DeleteUserRoomDto, createrId: number): Promise<import(".prisma/client").Room>;
    addUserRoom(roomId: number, addUserRoomDto: AddUserRoomDto, createrId: number): Promise<import(".prisma/client").Room>;
}
