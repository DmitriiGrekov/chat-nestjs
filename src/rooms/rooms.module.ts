import { Module } from '@nestjs/common';
import { RoomsService } from '../../src/rooms/rooms.service';
import { RoomsController } from '../../src/rooms/rooms.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from '../../src/auth/strategies/jwt-auth.strategies';
import { RoomsGateway } from './rooms.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService, JwtStrategy, RoomsGateway, JwtService]
})
export class RoomsModule { }
