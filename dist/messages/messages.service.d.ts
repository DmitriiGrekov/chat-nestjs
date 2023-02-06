import { Message } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "src/rooms/rooms.service";
import { CreateMessageDto } from "./dto/create-message.dto";
export declare class MessagesService {
    private prismaService;
    private roomService;
    constructor(prismaService: PrismaService, roomService: RoomsService);
    send(createMessageDto: CreateMessageDto, userId: number): Promise<Message>;
    findAll(params: {}, roomId: number, userId: number): Promise<Message[]>;
    remove(id: number, user_id: number): Promise<Message>;
}
