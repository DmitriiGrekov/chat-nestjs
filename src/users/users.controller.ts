import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @HttpCode(201)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  findProfile(@CurrentUser() userId: number) {
    return this.usersService.findOne({
      where: { id: +userId },
      select: { firstname: true, lastname: true, patroname: true, phone: true, id: true }
    });
  }

  @HttpCode(200)
  @Get('list')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({ where: { id: +id } });
    return this.usersService.exclude(user, ['password', 'email', 'phone']);
  }

  @HttpCode(200)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(+id);
  }
}
