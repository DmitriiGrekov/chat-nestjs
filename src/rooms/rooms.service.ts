import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { CreateRoomDto } from '../../src/rooms/dto/create-room.dto';
import { AddUserRoomDto } from '../../src/rooms//dto/add-user-room.dto';
import { DeleteUserRoomDto } from './dto/delete-user-room.dto';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RoomsGateway } from './rooms.gateway';
import { userSelect } from "src/users/users.controller";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(
    private prismaService: PrismaService,
    @InjectRedis() private redis: Redis,
    private roomsGateway: RoomsGateway) { }

  async create(createRoomDto: CreateRoomDto, userId?: number): Promise<Room> {
    try {
      const user = await this.prismaService.user.findFirst({ where: { id: userId } });
      if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
      return await this.prismaService.room.create({ data: { ...createRoomDto, creater: { connect: { id: userId } } } });
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(params = {}): Promise<Room[]> {
    try {
      return await this.prismaService.room.findMany(params);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: number, otherWhere = {}, otherIncludes = {}): Promise<Room> {
    try {
      const room = await this.prismaService.room.findFirst(
        {
          where: { AND: [{ id: +id }, { ...otherWhere }] },
          include: {
            users: {
              ...userSelect
            },
            message: {
              include: {
                User: {
                  ...userSelect
                },
              }
            },
            ...otherIncludes
          },
        }
      );
      if (!room) throw new HttpException('Комната не найдена', HttpStatus.NOT_FOUND);
      return room
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(roomId: number, createrId: number, data = {}, includeParams = {}): Promise<Room> {
    try {
      const room = await this.findOne(+roomId, { creater_id: createrId })
      if (!room) throw new HttpException('Комната не найдена', HttpStatus.NOT_FOUND);
      return await this.prismaService.room.update({ where: { id: roomId }, data: { ...data }, ...includeParams })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: number): Promise<Room> {
    try {
      const room = await this.findOne(+id);
      if (!room) throw new HttpException('Комната не найдена', HttpStatus.NOT_FOUND);
      return await this.prismaService.room.delete({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async addUserRoom(createrId: number, roomId: number, addUserRoomDto: AddUserRoomDto): Promise<Room> {
    try {
      const room = await this.findOne(+roomId, { creater_id: createrId });
      if (!room) throw new HttpException('Комната не найдена', HttpStatus.NOT_FOUND);

      const user = await this.prismaService.user.findFirst({ where: { id: addUserRoomDto.userId } });
      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);

      const response = await this.update(+roomId, createrId, {
        users:
        {
          connect: { id: addUserRoomDto.userId }
        }
      }, { include: { users: { select: { id: true, firstname: true, lastname: true, patroname: true, image: true } } } });

      let socketId: string = await this.redis.get(addUserRoomDto.userId.toString());
      if (socketId) {
        this.roomsGateway.sentNotification(socketId, response);
      }
      return response
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteUserFromRoom(createrId: number, roomId: number, deleteUserRoomDto: DeleteUserRoomDto) {
    try {
      const room = await this.findOne(+roomId, { creater_id: createrId });
      // const room = await this.prismaService.room.findFirst({ where: { id: roomId, creater_id: createrId } });
      if (!room) throw new HttpException('Комната не найдена', HttpStatus.NOT_FOUND);

      const user = await this.prismaService.user.findFirst({ where: { id: deleteUserRoomDto.userId } });
      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);

      return await this.update(+roomId, +createrId, {
        users:
        {
          disconnect: [{ id: deleteUserRoomDto.userId }]
        }
      }, { include: { users: { select: { id: true, firstname: true, lastname: true, patroname: true, image: true } } } });
    } catch (error) {
      throw new BadRequestException(error);
    }

  }
}
