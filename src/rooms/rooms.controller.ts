import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../src/auth/decorators/get-user.decorator';
import { AddUserRoomDto } from './dto/add-user-room.dto';
import { DeleteUserRoomDto } from './dto/delete-user-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() userId: number) {
    const room = await this.roomsService.create(createRoomDto, userId);
    return this.roomsService.addUserRoom(userId, room.id, { userId: userId })
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  findAll(@CurrentUser() userId: number) {
    return this.roomsService.findAll({
      where: { users: { some: { id: +userId } } },
      include: { users: { select: { firstname: true, lastname: true, patroname: true, id: true, image: true } }, Message: true }
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.roomsService.findOne(
      {
        where: { AND: [{ id: +id }, { users: { some: { id: userId } } }] },
        include: { users: { select: { firstname: true, lastname: true, patroname: true, id: true } }, Message: true }
      }
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':roomId')
  update(@Param('roomId') roomId: string, @Body() updateRoomDto: UpdateRoomDto, @CurrentUser() createrId: number) {
    return this.roomsService.update(+roomId, updateRoomDto, createrId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':roomId/user/disconnect')
  deleteUserFromRoom(@Param('roomId') roomId: number, @Body() deleteUserRoomDto: DeleteUserRoomDto, @CurrentUser() createrId: number) {
    return this.roomsService.deleteUserFromRoom(createrId, +roomId, deleteUserRoomDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':roomId/user')
  addUserRoom(@Param('roomId') roomId: number, @Body() addUserRoomDto: AddUserRoomDto, @CurrentUser() createrId: number) {
    return this.roomsService.addUserRoom(createrId, +roomId, addUserRoomDto);
  }
}
