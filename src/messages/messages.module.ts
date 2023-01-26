import { CacheModule, CacheStore, CACHE_MANAGER, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { RoomsService } from '../../src/rooms/rooms.service';
import { EventsGateway } from '../../src/events/events.gateway';
import { MessageGateway } from './message.gateway';
import { JwtService } from '@nestjs/jwt';
import redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, RoomsService, EventsGateway, MessageGateway, JwtService],
  imports: [
    CacheModule.register<ClientOpts>({
      isGlobal: true,
      //@ts-ignore
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ]
})
export class MessagesModule { }
