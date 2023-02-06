import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { AddUserRoomDto } from "./dto/add-user-room.dto";
import { DeleteUserRoomDto } from "./dto/delete-user-room.dto";
import { MessagesService } from "src/messages/messages.service";
import { JwtService } from "@nestjs/jwt";
import { userSelect } from "src/users/users.controller";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { prepareParams } from "src/config/search";
import { OptionsDto } from "src/config/dto/options.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/get-user.decorator";


@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService, @InjectRedis() private redis: Redis) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() userId: number) {
    const room = await this.roomsService.create(createRoomDto, userId);
    return this.roomsService.addUserRoom(userId, room.id, { userId: userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get("list")
  async findAll(@CurrentUser() userId: number, @Query() optionsDto: OptionsDto) {
    const params = prepareParams(optionsDto, { users: { some: { id: userId } } }, { include: { users: { ...userSelect }, message: true } });
    const rooms = await this.roomsService.findAll(params);
    const redisUser = JSON.parse(await this.redis.get(`user_id-${userId}`));

    rooms.forEach(room => {
      const dateDisconected = redisUser[0][room.id];
      const unreadMessage = room['message'].filter(m => {
        return new Date(m.created_at) > new Date(dateDisconected)
      });
      room['unreadMessage'] = unreadMessage.length;
    });

    return rooms;
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() userId: number) {
    return this.roomsService.findOne(+id, { users: { some: { id: userId } } });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":roomId")
  update(@Param("roomId") roomId: string, @Body() updateRoomDto: UpdateRoomDto, @CurrentUser() createrId: number) {
    return this.roomsService.update(+roomId, createrId, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roomsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":roomId/user/disconnect")
  deleteUserFromRoom(@Param("roomId") roomId: number, @Body() deleteUserRoomDto: DeleteUserRoomDto, @CurrentUser() createrId: number) {
    return this.roomsService.deleteUserFromRoom(createrId, +roomId, deleteUserRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":roomId/user")
  addUserRoom(@Param("roomId") roomId: number, @Body() addUserRoomDto: AddUserRoomDto, @CurrentUser() createrId: number) {
    return this.roomsService.addUserRoom(createrId, +roomId, addUserRoomDto);
  }
}
