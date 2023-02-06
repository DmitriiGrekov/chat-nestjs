import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageGateway } from "./message.gateway";
import { ChatGateway } from "src/rooms/chat.gateway";
import { RoomsService } from "src/rooms/rooms.service";
import Redis from "ioredis";
import { OptionsDto } from "src/config/dto/options.dto";
export declare class MessagesController {
    private readonly messagesService;
    private readonly messageGateway;
    private readonly roomService;
    private readonly chatGateway;
    private redis;
    constructor(messagesService: MessagesService, messageGateway: MessageGateway, roomService: RoomsService, chatGateway: ChatGateway, redis: Redis);
    send(createMessageDto: CreateMessageDto, userId: number): Promise<import(".prisma/client").Message>;
    findAll(roomId: number, userId: number, optionsDto: OptionsDto): Promise<import(".prisma/client").Message[]>;
    remove(id: string, userId: number): Promise<import(".prisma/client").Message>;
}
