import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageGateway } from './message.gateway';
import { JwtService } from '@nestjs/jwt';
import { RoomsGateway } from 'src/rooms/rooms.gateway';
import { ChatGateway } from 'src/rooms/chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, RoomsService, MessageGateway, JwtService, RoomsGateway, ChatGateway],

})
export class MessagesModule { }
