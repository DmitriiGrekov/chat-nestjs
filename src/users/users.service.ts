import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { userSelect } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userExists = await this.findAll({ where: { OR: [{ login: createUserDto.login }, { phone: createUserDto.phone }, { email: createUserDto.email }] } })
      if (userExists.length > 0) throw new HttpException('Данный логин, телефон или почта уже существует', HttpStatus.BAD_REQUEST);
      const hash = await bcrypt.hash(createUserDto.password, 10);
      return await this.prismaService.user.create({ data: { ...createUserDto, password: hash } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(params?) {
    try {
      return await this.prismaService.user.findMany(params);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: number, otherParams = {}) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { OR: [{ id: id }, { ...otherParams }] },
        ...userSelect
      });
      if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      return await this.prismaService.user.update({ where: { id: id }, data: { ...updateUserDto } })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.findOne(+id);
      if (!user) throw new HttpException('Пользователь не существует', HttpStatus.NOT_FOUND);
      return await this.prismaService.user.delete({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }
}


