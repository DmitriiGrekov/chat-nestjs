import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { AddUserRoomDto } from "./dto/add-user-room.dto";
import { DeleteUserRoomDto } from "./dto/delete-user-room.dto";
import { MessagesService } from "src/messages/messages.service";
import { JwtService } from "@nestjs/jwt";
export declare class RoomsController {
    private readonly roomsService;
    private readonly messageService;
    private readonly jwtService;
    constructor(roomsService: RoomsService, messageService: MessagesService, jwtService: JwtService);
    root(token: any): Promise<{
        rooms: import(".prisma/client").Room[];
    }>;
    rootOne(id: number): Promise<{
        room: import(".prisma/client").Room;
        messages: import(".prisma/client").Message[];
    }>;
    create(createRoomDto: CreateRoomDto, userId: number): Promise<import(".prisma/client").Room>;
    findAll(userId: number): Promise<import(".prisma/client").Room[]>;
    findOne(id: string, userId: number): Promise<import(".prisma/client").Room>;
    update(roomId: string, updateRoomDto: UpdateRoomDto, createrId: number): Promise<import(".prisma/client").Room>;
    remove(id: string): Promise<import(".prisma/client").Room>;
    deleteUserFromRoom(roomId: number, deleteUserRoomDto: DeleteUserRoomDto, createrId: number): Promise<import(".prisma/client").Room & {
        users: {
            id: number;
            image: string;
            firstname: string;
            lastname: string;
            patroname: string;
        }[];
    }>;
    addUserRoom(roomId: number, addUserRoomDto: AddUserRoomDto, createrId: number): Promise<import(".prisma/client").Room>;
}
