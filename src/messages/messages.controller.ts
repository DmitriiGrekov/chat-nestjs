import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  CACHE_MANAGER,
  CacheStore,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { JwtAuthGuard } from "../../src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../src/auth/decorators/get-user.decorator";
import { MessageGateway } from "./message.gateway";

@Controller("messages")
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messageGateway: MessageGateway
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post("send")
  async send(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() userId: number
  ) {
    const message = await this.messagesService.send(createMessageDto, +userId);
    this.messageGateway.sendMessage(message, createMessageDto.room_id);
    // this.messageGateway.sendMessage(`userRoomsWaitingMessage-${userId}`, message);
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Get("rooms/:id/list")
  findAll(@Param("id") roomId: number, @CurrentUser() userId: number) {
    return this.messagesService.findAll(
      { where: { room_id: +roomId }, include: { User: { select: { firstname: true, lastname: true, patroname: true, image: true, id: true } } } },
      +roomId,
      userId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/delete")
  remove(@Param("id") id: string, @CurrentUser() userId: number) {
    return this.messagesService.remove(+id, userId);
  }
}
