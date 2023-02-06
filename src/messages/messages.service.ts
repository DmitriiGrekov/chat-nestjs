import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  CACHE_MANAGER,
  Inject,
} from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "src/rooms/rooms.service";
import { userSelect } from "src/users/users.controller";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(private prismaService: PrismaService, private roomService: RoomsService) { }

  async send(createMessageDto: CreateMessageDto, userId: number): Promise<Message> {
    try {
      const room = await this.roomService.findOne(createMessageDto.room_id, userId);
      if (!room)
        throw new HttpException("Вы не являетесь участником данной комнаты", HttpStatus.BAD_REQUEST);
      return await this.prismaService.message.create({
        data: { ...createMessageDto, user_id: userId },
        include: { User: { ...userSelect } }
      });
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(params = {}, roomId: number, userId: number): Promise<Message[]> {
    try {
      const room = await this.roomService.findOne(roomId, userId);
      if (!room)
        throw new HttpException("Вы не являетесь участником данной комнаты", HttpStatus.BAD_REQUEST);

      return await this.prismaService.message.findMany(params);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number, user_id: number): Promise<Message> {
    try {
      const message = await this.prismaService.message.findFirst({
        where: { user_id, id },
      });
      if (!message)
        throw new HttpException("Сообщение не найдено", HttpStatus.NOT_FOUND);
      return await this.prismaService.message.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
