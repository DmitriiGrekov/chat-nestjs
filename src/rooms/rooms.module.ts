import { Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from 'src/messages/messages.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { JwtStrategy } from 'src/auth/strategies/jwt-auth.strategies';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService, JwtStrategy, RoomsGateway, JwtService, MessagesService, ChatGateway]
})
export class RoomsModule { }
