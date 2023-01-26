import { CacheStore } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageGateway } from './message.gateway';
export declare class MessagesController {
    private readonly messagesService;
    private readonly messageGateway;
    private cacheManager;
    constructor(messagesService: MessagesService, messageGateway: MessageGateway, cacheManager: CacheStore);
    send(createMessageDto: CreateMessageDto, userId: number): Promise<import(".prisma/client").Message>;
    findAll(roomId: number, userId: number): Promise<import(".prisma/client").Message[]>;
    remove(id: string, userId: number): Promise<import(".prisma/client").Message>;
}
