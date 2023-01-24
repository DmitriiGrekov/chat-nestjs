import { Module } from '@nestjs/common';
import { UsersService } from '../../src/users/users.service';
import { UsersController } from '../../src/users/users.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService]
})
export class UsersModule { }
