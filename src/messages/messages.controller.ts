import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageGateway } from "./message.gateway";
import { userSelect } from "src/users/users.controller";
import { ChatGateway } from "src/rooms/chat.gateway";
import { RoomsService } from "src/rooms/rooms.service";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { OptionsDto } from "src/config/dto/options.dto";
import { prepareParams } from "src/config/search";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/get-user.decorator";

@Controller("messages")
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messageGateway: MessageGateway,
    private readonly roomService: RoomsService,
    private readonly chatGateway: ChatGateway,
    @InjectRedis() private redis: Redis
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post("send")
  async send(@Body() createMessageDto: CreateMessageDto, @CurrentUser() userId: number
  ) {
    const message = await this.messagesService.send(createMessageDto, +userId);
    this.messageGateway.sendMessage(message, createMessageDto.room_id);
    const siteConnected = JSON.parse(await this.redis.get("siteConnected"));
    const room = await this.roomService.findOne(createMessageDto.room_id, userId);
    const userNotifySockets = [];
    room["users"].map((user: any) => {
      siteConnected.find((connect: any) => {
        if (Object.keys(connect).includes(user.id.toString())) {
          userNotifySockets.push(connect[user.id.toString()]);
        }
      });
    });
    this.chatGateway.sendUnreadedMessage(true, userNotifySockets);
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Get("rooms/:id/list")
  findAll(@Param("id") roomId: number, @CurrentUser() userId: number, @Query() optionsDto: OptionsDto) {
    const params = prepareParams(optionsDto, { room_id: +roomId }, { include: { User: { ...userSelect } } });
    return this.messagesService.findAll(params, +roomId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/delete")
  remove(@Param("id") id: string, @CurrentUser() userId: number) {
    return this.messagesService.remove(+id, userId);
  }
}
