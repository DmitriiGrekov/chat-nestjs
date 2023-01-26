import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject, CACHE_MANAGER, CacheStore } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../src/auth/decorators/get-user.decorator';
import { EventsGateway } from 'src/events/events.gateway';
import { MessageGateway } from './message.gateway';
import { RadisCacheService } from 'src/rdis-cache/radis-cache.service';
import { Cache } from 'cache-manager';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messageGateway: MessageGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async send(@Body() createMessageDto: CreateMessageDto, @CurrentUser() userId: number) {
    const message = await this.messagesService.send(createMessageDto, +userId);
    // this.messageGateway.sendMessage(`messageSent-${createMessageDto.room_id}`, message);
    // this.messageGateway.sendMessage(`userRoomsWaitingMessage-${userId}`, message);
    await this.cacheManager.set('name', 'Dmitrii');
    console.log(await this.cacheManager.get('name'))
    return message
  }

  @UseGuards(JwtAuthGuard)
  @Get('rooms/:id/list')
  findAll(@Param('id') roomId: number, @CurrentUser() userId: number) {
    return this.messagesService.findAll({ where: { room_id: +roomId } }, +roomId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/delete')
  remove(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.messagesService.remove(+id, userId);
  }
}
