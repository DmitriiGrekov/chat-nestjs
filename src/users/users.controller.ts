import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Query, BadRequestException, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/get-user.decorator';
import { prepareParams } from 'src/config/search';
import { OptionsDto } from 'src/config/dto/options.dto';

export const userSelect = {
  select: {
    firstname: true,
    lastname: true,
    patroname: true,
    id: true,
    image: true,
    login: true
  }
}

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
    return this.usersService.findOne(userId);
  }

  @HttpCode(200)
  @Get('list')
  findAll(@Query() optionsDto: OptionsDto) {
    try {
      const params = prepareParams(optionsDto, {}, {}, { select: { id: true, email: true, image: true, firstname: true, lastname: true, patroname: true, login: true } });
      return this.usersService.findAll(params);
    } catch (error) {
      throw new BadRequestException(error)
    }

  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
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
